import { Canvas, useFrame, useThree, type ThreeElements, type ThreeEvent } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, RoundedBox, Text } from '@react-three/drei'
import { useLayoutEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import * as THREE from 'three'
import fontUrl from '@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-600-normal.woff?url'
import { experience, profile, stops, type StopId } from './content'

const C = {
  felt: '#9a9a94',
  desk: '#4a4f55',
  alu: '#d9dcdf',
  kraft: '#c8a77a',
  ink: '#1d2024',
  teal: '#1f8a8a',
  paper: '#eceae4',
}

type Props = {
  progress: RefObject<number>
  active: number
  reducedMotion: boolean
  onSelect: (id: StopId) => void
}

// Camera pose per tour stop. `off` shifts the projection so the subject sits beside the reading sheet:
// a fraction of width on landscape screens, of height on portrait screens.
type V3 = [number, number, number]
type Pose = { pos: V3; look: V3; off: number; offP: number; posP?: V3 }
const POSES: Record<StopId, Pose> = {
  desk: { pos: [0.2, 1.36, 1.56], look: [0.16, 0, 0.1], off: -0.17, offP: -0.5, posP: [0.12, 3.3, 1.5] },
  bantay: { pos: [0.42, 0.6, 0.58], look: [0.3, 0.07, -0.2], off: 0.2, offP: 0.1, posP: [0.42, 1.2, 1.05] },
  laredo: { pos: [0.12, 0.62, 0.3], look: [-0.04, 0, -0.26], off: 0.2, offP: 0.12, posP: [0.1, 1.15, 0.5] },
  brewview: { pos: [0.5, 0.42, 0.18], look: [0.6, 0.06, -0.3], off: 0.2, offP: 0.12, posP: [0.55, 0.95, 0.35] },
  experience: { pos: [0.03, 0.66, 0.4], look: [0.02, 0, 0.08], off: 0.2, offP: 0.22 },
  skills: { pos: [0.48, 0.42, 0.74], look: [0.58, 0.05, 0.3], off: 0.2, offP: 0.24, posP: [0.5, 0.78, 1.0] },
  contact: { pos: [0.38, 0.5, 0.82], look: [0.36, 0, 0.44], off: 0.2, offP: 0.22 },
}
const poseList = stops.map((s) => POSES[s.id])

// Narrow screens: a pose's own portrait position, or the landscape one pulled back to fit.
function portraitPos(p: Pose): V3 {
  if (p.posP) return p.posP
  return p.pos.map((v, i) => p.look[i] + (v - p.look[i]) * 1.8) as V3
}

// Procedural fibre texture: a base tone plus thousands of short strands. Used for felt and kraft.
function fibreTexture(base: string, strands: number, light: string, dark: string, len: number, repeat: number, alpha = 0.14, mottle = 0) {
  const size = 512
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')!
  g.fillStyle = base
  g.fillRect(0, 0, size, size)
  // Heather: broad soft patches of lighter and darker wool under the fibres.
  for (let i = 0; i < mottle; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const r = 2 + Math.random() * 7
    const grad = g.createRadialGradient(x, y, 0, x, y, r)
    grad.addColorStop(0, Math.random() < 0.5 ? light : dark)
    grad.addColorStop(1, 'transparent')
    g.globalAlpha = 0.12
    g.fillStyle = grad
    // Draw wrapped copies so patches crossing an edge tile without seams.
    for (const dx of [-size, 0, size])
      for (const dy of [-size, 0, size]) {
        g.save()
        g.translate(dx, dy)
        g.fillRect(x - r, y - r, r * 2, r * 2)
        g.restore()
      }
  }
  for (let i = 0; i < strands; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const a = Math.random() * Math.PI * 2
    const l = len * (0.4 + Math.random())
    g.strokeStyle = Math.random() < 0.5 ? light : dark
    g.globalAlpha = alpha * (0.4 + Math.random() * 0.6)
    g.lineWidth = 0.5 + Math.random() * 0.6
    g.beginPath()
    g.moveTo(x, y)
    g.quadraticCurveTo(x + Math.cos(a + 0.6) * l * 0.5, y + Math.sin(a + 0.6) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l)
    g.stroke()
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(repeat, repeat)
  t.anisotropy = 8
  return t
}

function useMaterials() {
  return useMemo(() => {
    // Base sits below the #9a9a94 token because window light lifts it; lit, it reads close to the token.
    const feltMap = fibreTexture('#7c7d78', 30000, '#9d9e98', '#62635f', 5, 6, 0.1, 5000)
    feltMap.colorSpace = THREE.SRGBColorSpace
    const feltBump = fibreTexture('#808080', 30000, '#ffffff', '#000000', 5, 6, 0.22)
    const kraftMap = fibreTexture(C.kraft, 5000, '#ddc097', '#a5845a', 8, 2)
    kraftMap.colorSpace = THREE.SRGBColorSpace
    return {
      felt: new THREE.MeshPhysicalMaterial({
        map: feltMap,
        bumpMap: feltBump,
        bumpScale: 0.9,
        roughness: 1,
        sheen: 1,
        sheenRoughness: 0.75,
        sheenColor: new THREE.Color('#d8d8d2'),
      }),
      desk: new THREE.MeshStandardMaterial({ color: C.desk, roughness: 0.55 }),
      alu: new THREE.MeshPhysicalMaterial({ color: C.alu, metalness: 0.55, roughness: 0.42, anisotropy: 0.7, anisotropyRotation: Math.PI / 2 }),
      darkAlu: new THREE.MeshPhysicalMaterial({ color: '#8d9297', metalness: 0.6, roughness: 0.45 }),
      key: new THREE.MeshStandardMaterial({ color: '#2b2f34', roughness: 0.7 }),
      glass: new THREE.MeshPhysicalMaterial({ color: '#c3c7cb', metalness: 0.4, roughness: 0.28 }),
      emboss: new THREE.MeshStandardMaterial({ color: '#ecece7', roughness: 0.45 }),
      teal: new THREE.MeshPhysicalMaterial({ color: C.teal, metalness: 0.85, roughness: 0.3, clearcoat: 0.4 }),
      kraft: new THREE.MeshStandardMaterial({ map: kraftMap, roughness: 0.92 }),
      paper: new THREE.MeshStandardMaterial({ color: C.paper, roughness: 0.9 }),
      ink: new THREE.MeshStandardMaterial({ color: '#25292d', roughness: 0.6 }),
      news: new THREE.MeshStandardMaterial({ color: '#e4e1d8', roughness: 0.95 }),
      photo: new THREE.MeshStandardMaterial({ color: '#8a8f94', roughness: 0.9 }),
      tape: new THREE.MeshPhysicalMaterial({ color: '#17191c', roughness: 0.38, clearcoat: 0.6 }),
      ceramic: new THREE.MeshPhysicalMaterial({ color: '#c9ccc9', roughness: 0.35, clearcoat: 1, clearcoatRoughness: 0.15 }),
      coffee: new THREE.MeshPhysicalMaterial({ color: '#24170f', roughness: 0.08, clearcoat: 1 }),
      screen: new THREE.MeshBasicMaterial({ color: '#15181b' }),
    }
  }, [])
}
type Mats = ReturnType<typeof useMaterials>

function CameraRig({ progress, reducedMotion }: { progress: RefObject<number>; reducedMotion: boolean }) {
  const { camera, size, pointer } = useThree()
  const cam = camera as THREE.PerspectiveCamera
  const state = useMemo(
    () => ({
      pos: new THREE.Vector3(...poseList[0].pos),
      look: new THREE.Vector3(...poseList[0].look),
      off: poseList[0].off,
      goalPos: new THREE.Vector3(),
      goalLook: new THREE.Vector3(),
      tmp: new THREE.Vector3(),
    }),
    [],
  )

  useFrame((_, dt) => {
    const s = state
    const p = progress.current ?? 0
    const i = Math.min(Math.floor(p), poseList.length - 1)
    const f = p - i
    const e = f * f * (3 - 2 * f)
    const a = poseList[i]
    const b = poseList[Math.min(i + 1, poseList.length - 1)]
    const portrait = size.width < size.height
    s.goalPos.fromArray(portrait ? portraitPos(a) : a.pos).lerp(s.tmp.fromArray(portrait ? portraitPos(b) : b.pos), e)
    s.goalLook.fromArray(a.look).lerp(s.tmp.fromArray(b.look), e)
    const goalOff = portrait ? a.offP + (b.offP - a.offP) * e : a.off + (b.off - a.off) * e

    if (!reducedMotion) {
      s.goalPos.x += pointer.x * 0.025
      s.goalPos.y += pointer.y * 0.015
    }

    const k = reducedMotion ? 1 : 1 - Math.exp(-3.2 * dt)
    s.pos.lerp(s.goalPos, k)
    s.look.lerp(s.goalLook, k)
    s.off += (goalOff - s.off) * k

    cam.position.copy(s.pos)
    cam.lookAt(s.look)
    const w = size.width
    const h = size.height
    if (portrait) cam.setViewOffset(w, h, 0, s.off * h, w, h)
    else cam.setViewOffset(w, h, s.off * w, 0, w, h)
  })
  return null
}

// Clickable desk object. Hover lifts it; the active stop rests slightly raised. State by form, not hue.
type HotspotProps = { id: StopId; active: boolean; onSelect: (id: StopId) => void; children: ReactNode } & Pick<ThreeElements['group'], 'position' | 'rotation'>
function Hotspot({ id, active, onSelect, children, ...rest }: HotspotProps) {
  const lift = useRef<THREE.Group>(null)
  const [hover, setHover] = useState(false)
  useFrame((_, dt) => {
    if (!lift.current) return
    const goal = hover ? 0.014 : active ? 0.006 : 0
    lift.current.position.y += (goal - lift.current.position.y) * (1 - Math.exp(-10 * dt))
  })
  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHover(true)
    document.body.style.cursor = 'pointer'
  }
  const out = () => {
    setHover(false)
    document.body.style.cursor = ''
  }
  return (
    <group {...rest}>
      <group
        ref={lift}
        onPointerOver={over}
        onPointerOut={out}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(id)
        }}
      >
        {children}
      </group>
    </group>
  )
}

// Flat printed text lying on a surface.
function Label({ children, size = 0.01, color = C.ink, position, maxWidth, lineHeight }: { children: string; size?: number; color?: string; position: [number, number, number]; maxWidth?: number; lineHeight?: number }) {
  return (
    <Text font={fontUrl} fontSize={size} color={color} anchorX="left" anchorY="top" rotation={[-Math.PI / 2, 0, 0]} position={position} maxWidth={maxWidth} lineHeight={lineHeight}>
      {children}
    </Text>
  )
}

// Keycap rows in key units: function row, number row, tab, caps, shift, and the spacebar row.
const KEY_ROWS = [
  Array(15).fill(1),
  [...Array(14).fill(1), 1.5],
  [1.5, ...Array(12).fill(1), 1.5],
  [1.75, ...Array(11).fill(1), 2.25],
  [2.25, ...Array(10).fill(1), 2.75],
  [1.25, 1, 1, 1.25, 6, 1.25, 1, 1, 1.25],
]
const KEY_COUNT = KEY_ROWS.reduce((n, r) => n + r.length, 0)

// All keycaps in one instanced mesh; each cap is a unit box scaled to its width.
function Keys({ m }: { m: Mats }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  useLayoutEffect(() => {
    const width = 0.2635
    const depth = 0.098
    const gap = 0.0022
    const rowD = (depth - gap * (KEY_ROWS.length - 1)) / KEY_ROWS.length
    const o = new THREE.Object3D()
    let i = 0
    KEY_ROWS.forEach((row, r) => {
      const units = row.reduce((a, b) => a + b, 0)
      const unit = (width - gap * (row.length - 1)) / units
      // The function row is half height, like a real deck.
      const d = r === 0 ? rowD * 0.6 : rowD
      const z = -0.07 + r * (rowD + gap) + (r === 0 ? rowD * 0.2 : 0)
      let x = -width / 2
      for (const w of row) {
        const kw = w * unit
        o.position.set(x + kw / 2, 0.0129, z + rowD / 2)
        o.scale.set(kw, 1, d)
        o.updateMatrix()
        ref.current!.setMatrixAt(i++, o.matrix)
        x += kw + gap
      }
    })
    ref.current!.instanceMatrix.needsUpdate = true
  }, [])
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, KEY_COUNT]} material={m.key} castShadow receiveShadow>
      <boxGeometry args={[1, 0.0014, 1]} />
    </instancedMesh>
  )
}

function Laptop({ m }: { m: Mats }) {
  return (
    <group>
      <RoundedBox args={[0.31, 0.012, 0.215]} radius={0.005} smoothness={4} position={[0, 0.006, 0]} material={m.alu} castShadow receiveShadow />
      <mesh position={[0, 0.0122, -0.02]} rotation={[-Math.PI / 2, 0, 0]} material={m.ink}>
        <planeGeometry args={[0.272, 0.108]} />
      </mesh>
      <Keys m={m} />
      <mesh position={[0, 0.0122, 0.07]} rotation={[-Math.PI / 2, 0, 0]} material={m.glass}>
        <planeGeometry args={[0.092, 0.056]} />
      </mesh>
      <mesh position={[0, 0.012, -0.104]} rotation={[0, 0, Math.PI / 2]} material={m.darkAlu} castShadow>
        <cylinderGeometry args={[0.0042, 0.0042, 0.24, 20]} />
      </mesh>
      {/* Lid hinged at the back edge, opened about 108 degrees. */}
      <group position={[0, 0.012, -0.1075]} rotation={[-1.88, 0, 0]}>
        <RoundedBox args={[0.31, 0.007, 0.215]} radius={0.003} smoothness={4} position={[0, 0.0035, 0.1075]} material={m.alu} castShadow receiveShadow />
        <group position={[0, -0.0002, 0.1075]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh material={m.screen}>
            <planeGeometry args={[0.285, 0.19]} />
          </mesh>
          <Text font={fontUrl} fontSize={0.032} color={C.alu} anchorX="left" anchorY="top" position={[-0.122, 0.072, 0.001]} letterSpacing={0.02}>
            BANTAY
          </Text>
          <Text font={fontUrl} fontSize={0.0098} color="#9aa0a6" anchorX="left" anchorY="top" position={[-0.122, 0.03, 0.001]} maxWidth={0.24} lineHeight={1.35}>
            {'Handwritten barangay records,\nclassified and searchable'}
          </Text>
          <Text font={fontUrl} fontSize={0.0088} color={C.alu} anchorX="left" anchorY="bottom" position={[-0.122, -0.074, 0.001]}>
            {'Thesis project'}
          </Text>
        </group>
      </group>
    </group>
  )
}

function Clipboard({ m }: { m: Mats }) {
  return (
    <group>
      <RoundedBox args={[0.23, 0.004, 0.32]} radius={0.0019} smoothness={3} position={[0, 0.002, 0]} material={m.alu} castShadow receiveShadow />
      <mesh position={[0, 0.0045, 0.012]} material={m.paper} castShadow receiveShadow>
        <boxGeometry args={[0.212, 0.0009, 0.282]} />
      </mesh>
      <RoundedBox args={[0.1, 0.012, 0.032]} radius={0.004} smoothness={3} position={[0, 0.009, -0.142]} material={m.darkAlu} castShadow />
      <Label size={0.017} position={[-0.09, 0.0052, -0.11]}>Experience</Label>
      {experience.map((e, i) => (
        <group key={e.org} position={[0, 0, i === 0 ? -0.088 : 0.03]}>
          <Label size={0.0078} position={[-0.09, 0.0052, 0]} maxWidth={0.19}>
            {`${e.role}, ${e.org}`}
          </Label>
          <Label size={0.0052} color="#4d5258" position={[-0.09, 0.0052, 0.012]} maxWidth={0.19}>
            {`${e.period} · ${e.where}`}
          </Label>
          <Label size={0.0052} position={[-0.09, 0.0052, 0.024]} maxWidth={0.19} lineHeight={1.3}>
            {e.points.map((pt) => `– ${pt}`).join('\n')}
          </Label>
        </group>
      ))}
    </group>
  )
}

// Kraft coffee bag with a rating label: five stars under the BrewView name.
function CoffeeBag({ m }: { m: Mats }) {
  const w = 0.09
  const h = 0.14
  const d = 0.05
  const star = useMemo(() => {
    const s = new THREE.Shape()
    for (let i = 0; i < 10; i++) {
      const r = i % 2 ? 0.0045 : 0.01
      const a = Math.PI / 2 + (i * Math.PI) / 5
      const x = Math.cos(a) * r
      const y = Math.sin(a) * r
      if (i === 0) s.moveTo(x, y)
      else s.lineTo(x, y)
    }
    s.closePath()
    return new THREE.ShapeGeometry(s)
  }, [])
  return (
    <group>
      <RoundedBox args={[w, h, d]} radius={0.006} smoothness={3} position={[0, h / 2, 0]} material={m.kraft} castShadow receiveShadow />
      {/* Folded, crimped top */}
      <RoundedBox args={[w * 0.96, 0.02, 0.012]} radius={0.003} smoothness={2} position={[0, h + 0.008, 0]} material={m.kraft} castShadow />
      <mesh position={[0, h + 0.006, d / 2 + 0.0006]} material={m.ink}>
        <planeGeometry args={[w * 0.9, 0.0016]} />
      </mesh>
      {/* Front label */}
      <mesh position={[0, 0.062, d / 2 + 0.0008]} material={m.paper}>
        <planeGeometry args={[0.072, 0.078]} />
      </mesh>
      <Text font={fontUrl} fontSize={0.0105} color={C.ink} anchorX="center" anchorY="middle" position={[0, 0.088, d / 2 + 0.0016]} letterSpacing={0.04}>
        BREWVIEW
      </Text>
      {[-2, -1, 0, 1, 2].map((i) => (
        <mesh key={i} geometry={star} position={[i * 0.0125, 0.068, d / 2 + 0.0016]} material={m.teal} />
      ))}
      <Text font={fontUrl} fontSize={0.0052} color="#4d5258" anchorX="center" anchorY="middle" position={[0, 0.047, d / 2 + 0.0016]} letterSpacing={0.06}>
        COFFEE REVIEWS
      </Text>
    </group>
  )
}

// Newsprint front page: masthead, lead story with a photo block, and columns of body text.
function Newspaper({ m }: { m: Mats }) {
  const w = 0.23
  const d = 0.31
  const x0 = -w / 2 + 0.012
  const colW = (w - 0.024 - 0.008) / 3
  const cols = [0, 1, 2]
  return (
    <group>
      {/* Back sheet peeking out below the front page. */}
      <mesh position={[0.004, 0.0008, 0.006]} rotation={[0, 0.03, 0]} material={m.paper} castShadow receiveShadow>
        <boxGeometry args={[w, 0.0016, d]} />
      </mesh>
      <mesh position={[0, 0.0026, 0]} material={m.news} castShadow receiveShadow>
        <boxGeometry args={[w, 0.0018, d]} />
      </mesh>
      <group position={[0, 0.0036, 0]}>
        <Label size={0.0275} color={C.ink} position={[x0, 0, -d / 2 + 0.01]}>
          24/7 LAREDO
        </Label>
        <mesh position={[0, 0, -d / 2 + 0.0445]} rotation={[-Math.PI / 2, 0, 0]} material={m.ink}>
          <planeGeometry args={[w - 0.024, 0.0014]} />
        </mesh>
        <Label size={0.0046} color="#4d5258" position={[x0, 0, -d / 2 + 0.0475]}>
          Original. Free. Independent News.
        </Label>
        <Label size={0.0125} color={C.ink} position={[x0, 0, -d / 2 + 0.058]} maxWidth={w - 0.024} lineHeight={1.05}>
          {'Local news for Laredo\nand Webb County'}
        </Label>
        {/* Photo block */}
        <mesh position={[0, 0, -0.012]} rotation={[-Math.PI / 2, 0, 0]} material={m.photo}>
          <planeGeometry args={[w - 0.024, 0.07]} />
        </mesh>
        {/* Body columns as ruled text */}
        {cols.map((c) =>
          Array.from({ length: 9 }).map((_, i) => (
            <mesh
              key={`${c}-${i}`}
              position={[x0 + c * (colW + 0.004) + (colW - (i % 4 === 3 ? 0.012 : 0)) / 2, 0, 0.036 + i * 0.0105]}
              rotation={[-Math.PI / 2, 0, 0]}
              material={m.ink}
            >
              <planeGeometry args={[colW - (i % 4 === 3 ? 0.012 : 0), 0.0015]} />
            </mesh>
          )),
        )}
      </group>
    </group>
  )
}

const tabs = ['Backend', 'Frontend', 'Design']

function CardBox({ m }: { m: Mats }) {
  const w = 0.14
  const d = 0.2
  const h = 0.06
  const t = 0.003
  const walls: [number, number, number, number, number, number][] = [
    [0, h / 2, -d / 2 + t / 2, w, h, t],
    [0, h / 2, d / 2 - t / 2, w, h, t],
    [-w / 2 + t / 2, h / 2, 0, t, h, d],
    [w / 2 - t / 2, h / 2, 0, t, h, d],
  ]
  return (
    <group>
      <mesh position={[0, t / 2, 0]} material={m.kraft} castShadow receiveShadow>
        <boxGeometry args={[w, t, d]} />
      </mesh>
      {walls.map(([x, y, z, bw, bh, bd], i) => (
        <mesh key={i} position={[x, y, z]} material={m.kraft} castShadow receiveShadow>
          <boxGeometry args={[bw, bh, bd]} />
        </mesh>
      ))}
      {tabs.map((label, i) => {
        const tx = i % 2 ? 0.03 : -0.03
        return (
          <group key={label} position={[0, 0, -0.05 + i * 0.05]} rotation={[-0.12, 0, 0]}>
            <mesh position={[0, 0.042, 0]} material={m.paper} castShadow receiveShadow>
              <boxGeometry args={[0.128, 0.076, 0.0012]} />
            </mesh>
            <mesh position={[tx, 0.086, 0]} material={m.paper} castShadow>
              <boxGeometry args={[0.05, 0.014, 0.0012]} />
            </mesh>
            <Text font={fontUrl} fontSize={0.0068} color={C.ink} anchorX="center" anchorY="middle" position={[tx, 0.086, 0.0008]}>
              {label}
            </Text>
          </group>
        )
      })}
    </group>
  )
}

function Envelope({ m }: { m: Mats }) {
  const flap = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(-0.11, 0)
    s.lineTo(0, -0.05)
    s.lineTo(0.11, 0)
    s.lineTo(-0.11, 0)
    return new THREE.ExtrudeGeometry(s, { depth: 0.0006, bevelEnabled: false })
  }, [])
  return (
    <group>
      <mesh position={[0, 0.0015, 0]} material={m.kraft} castShadow receiveShadow>
        <boxGeometry args={[0.22, 0.003, 0.11]} />
      </mesh>
      <mesh geometry={flap} material={m.kraft} position={[0, 0.0031, -0.055]} rotation={[Math.PI / 2, 0, 0]} castShadow />
      <Label size={0.0095} position={[-0.02, 0.0032, 0.012]}>R. K. Sarzona</Label>
      <Label size={0.0068} color="#3b3328" position={[-0.02, 0.0032, 0.028]}>rastafarisarzona2@gmail.com</Label>
      <Tape text="CONTACT" position={[-0.095, 0.0032, 0.03]} rotation={[0, 0.04, 0]} m={m} />
    </group>
  )
}

function Mug({ m }: { m: Mats }) {
  const body = useMemo(() => {
    const pts = [
      [0, 0],
      [0.038, 0],
      [0.042, 0.004],
      [0.042, 0.092],
      [0.0395, 0.095],
      [0.0375, 0.092],
      [0.0375, 0.008],
      [0, 0.008],
    ].map(([x, y]) => new THREE.Vector2(x, y))
    return new THREE.LatheGeometry(pts, 64)
  }, [])
  return (
    <group>
      <mesh geometry={body} material={m.ceramic} castShadow receiveShadow />
      <mesh position={[0, 0.074, 0]} rotation={[-Math.PI / 2, 0, 0]} material={m.coffee}>
        <circleGeometry args={[0.0376, 48]} />
      </mesh>
      <mesh position={[0.046, 0.05, 0]} rotation={[0, 0, -Math.PI / 2]} material={m.ceramic} castShadow>
        <torusGeometry args={[0.024, 0.0055, 16, 32, Math.PI]} />
      </mesh>
    </group>
  )
}

function Pen({ m }: { m: Mats }) {
  return (
    <group rotation={[0, 0, Math.PI / 2]} position={[0, 0.0046, 0]}>
      <mesh material={m.teal} castShadow>
        <cylinderGeometry args={[0.0046, 0.0046, 0.13, 24]} />
      </mesh>
      <mesh position={[0, -0.072, 0]} rotation={[Math.PI, 0, 0]} material={m.alu} castShadow>
        <coneGeometry args={[0.0046, 0.014, 24]} />
      </mesh>
      <mesh position={[0.0052, 0.038, 0]} material={m.alu} castShadow>
        <boxGeometry args={[0.0018, 0.045, 0.003]} />
      </mesh>
    </group>
  )
}

// Embossed label tape: dark glossy strip with raised light letters.
function Tape({ text, m, scale = 1, ...rest }: { text: string; m: Mats; scale?: number } & ThreeElements['group']) {
  const w = (text.length * 0.0074 + 0.016) * scale
  const fs = 0.0098 * scale
  const x = 0.008 * scale
  const shared = { font: fontUrl, fontSize: fs, letterSpacing: 0.09, anchorX: 'left', anchorY: 'middle', rotation: [-Math.PI / 2, 0, 0] } as const
  return (
    <group {...rest}>
      <RoundedBox args={[w, 0.0012 * scale, 0.0165 * scale]} radius={0.0005 * scale} smoothness={2} position={[w / 2, 0.0006 * scale, 0]} material={m.tape} castShadow receiveShadow />
      {/* Embossed relief: the raised letters' shaded edge, away from the window, under the lit letter face. */}
      <Text {...shared} color="#000000" fillOpacity={0.6} position={[x + 0.0005 * scale, 0.00122 * scale, 0.0006 * scale]}>
        {text}
      </Text>
      <Text {...shared} material={m.emboss} position={[x, 0.0013 * scale, 0]}>
        {text}
      </Text>
    </group>
  )
}

function Desk({ active, onSelect }: { active: number; onSelect: (id: StopId) => void }) {
  const m = useMaterials()
  const is = (id: StopId) => stops[active]?.id === id
  return (
    <group>
      <mesh position={[0, -0.003, 0]} material={m.desk} receiveShadow>
        <boxGeometry args={[8, 0.006, 6]} />
      </mesh>
      <RoundedBox args={[7, 0.005, 7]} radius={0.0024} smoothness={3} position={[0, 0.0025, 0]} material={m.felt} receiveShadow />
      <group position={[0, 0.005, 0]}>
        <Hotspot id="bantay" active={is('bantay')} onSelect={onSelect} position={[0.3, 0, -0.22]} rotation={[0, -0.14, 0]}>
          <Laptop m={m} />
        </Hotspot>
        <Hotspot id="laredo" active={is('laredo')} onSelect={onSelect} position={[-0.04, 0, -0.26]} rotation={[0, 0.2, 0]}>
          <Newspaper m={m} />
        </Hotspot>
        <Hotspot id="experience" active={is('experience')} onSelect={onSelect} position={[0.02, 0, 0.08]} rotation={[0, 0.16, 0]}>
          <Clipboard m={m} />
        </Hotspot>
        <Hotspot id="skills" active={is('skills')} onSelect={onSelect} position={[0.58, 0, 0.3]} rotation={[0, -0.32, 0]}>
          <CardBox m={m} />
        </Hotspot>
        <Hotspot id="contact" active={is('contact')} onSelect={onSelect} position={[0.36, 0, 0.44]} rotation={[0, 0.07, 0]}>
          <Envelope m={m} />
        </Hotspot>
        <Hotspot id="brewview" active={is('brewview')} onSelect={onSelect} position={[0.6, 0, -0.3]} rotation={[0, -0.12, 0]}>
          <CoffeeBag m={m} />
          <group position={[0.1, 0, 0.2]}>
            <Mug m={m} />
          </group>
        </Hotspot>
        <group position={[0.22, 0, 0.1]} rotation={[0, 0.5, 0]}>
          <Pen m={m} />
        </group>
        <group position={[-0.66, 0, 0.48]} rotation={[0, 0.04, 0]}>
          {profile.roles.map((r, i) => (
            <Tape key={r} text={r.toUpperCase()} scale={2.4} m={m} position={[i % 2 ? 0.02 : 0, 0, i * 0.058]} rotation={[0, (i % 2 ? -1 : 1) * 0.022, 0]} />
          ))}
        </group>
      </group>
    </group>
  )
}

export default function Scene({ progress, active, reducedMotion, onSelect }: Props) {
  return (
    <div className="scene" aria-hidden="true">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ fov: 32, near: 0.05, far: 12, position: poseList[0].pos }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 0.86 }}
        style={{ touchAction: 'pan-y' }}
      >
        <color attach="background" args={['#61625e']} />
        <fog attach="fog" args={['#61625e', 3, 8]} />
        <hemisphereLight args={['#eef1f3', '#6a6b67', 0.4]} />
        <directionalLight
          position={[-2.0, 2.3, 0.15]}
          intensity={3.4}
          color="#f7f5f0"
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
          shadow-normalBias={0.0015}
          shadow-radius={5}
          shadow-camera-left={-1.3}
          shadow-camera-right={1.3}
          shadow-camera-top={1.3}
          shadow-camera-bottom={-1.3}
          shadow-camera-near={0.5}
          shadow-camera-far={6}
        />
        {/* Soft north-window daylight for reflections on the aluminium; built locally, no HDR download. */}
        <Environment resolution={256} frames={1} environmentIntensity={1.1}>
          <Lightformer form="rect" intensity={1.6} color="#f4f6f8" position={[-2.5, 3, -1.5]} scale={[4, 2.5, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={0.6} color="#e7e2d8" position={[3, 1.5, 1.5]} scale={[3, 2, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={1.2} color="#eef0f2" position={[0, 2, 3]} scale={[5, 3, 1]} target={[0, 0, 0]} />
          <Lightformer form="rect" intensity={1.1} color="#eef0f2" position={[0, 3.5, 0.4]} rotation-x={Math.PI / 2} scale={[3, 2, 1]} />
          <Lightformer form="rect" intensity={0.25} color="#9a9a94" position={[0, -1, 0]} rotation-x={Math.PI / 2} scale={[6, 6, 1]} />
        </Environment>
        <Desk active={active} onSelect={onSelect} />
        <ContactShadows position={[0, 0.0052, 0.05]} scale={[2.4, 1.6]} resolution={1024} blur={2.4} opacity={0.55} far={0.12} color="#23262a" frames={1} />
        <CameraRig progress={progress} reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  )
}
