'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Weather cloud system
export const WeatherClouds = ({ intensity = 0.5 }: { intensity?: number }) => {
  const cloudsRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (cloudsRef.current) {
      const time = state.clock.getElapsedTime()
      cloudsRef.current.rotation.y = time * 0.02
      cloudsRef.current.children.forEach((cloud, index) => {
        const offset = index * 0.5
        cloud.position.y = Math.sin(time * 0.5 + offset) * 0.1
      })
    }
  })

  // Generate cloud positions around globe
  const cloudCount = 12
  const clouds = Array.from({ length: cloudCount }, (_, i) => {
    const angle = (i / cloudCount) * Math.PI * 2
    const radius = 2.5
    return {
      x: Math.cos(angle) * radius,
      y: (Math.random() - 0.5) * 0.5,
      z: Math.sin(angle) * radius,
      scale: 0.3 + Math.random() * 0.2,
    }
  })

  return (
    <group ref={cloudsRef}>
      {clouds.map((cloud, i) => (
        <mesh key={i} position={[cloud.x, cloud.y, cloud.z]} scale={cloud.scale}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial
            color="#55DDCA"
            transparent
            opacity={0.1 * intensity}
            emissive="#55DDCA"
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

// Atmospheric fog/glow effect
export const AtmosphericGlow = ({ color = '#55DDCA' }: { color?: string }) => {
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (glowRef.current) {
      const time = state.clock.getElapsedTime()
      const material = glowRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.08 + Math.sin(time * 0.5) * 0.02
    }
  })

  return (
    <mesh ref={glowRef}>
      <sphereGeometry args={[3.5, 32, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.08} side={THREE.BackSide} />
    </mesh>
  )
}

// Dynamic heatmap visualization for crowd density
export const HeatmapPulse = ({
  intensity = 50,
  position,
}: {
  intensity?: number
  position: [number, number, number]
}) => {
  const pulseRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (pulseRef.current) {
      const time = state.clock.getElapsedTime()
      const scale = 1 + Math.sin(time * (intensity / 30)) * 0.15
      pulseRef.current.scale.setScalar(scale)

      const material = pulseRef.current.material as THREE.MeshStandardMaterial
      material.opacity = 0.3 + Math.sin(time * (intensity / 30)) * 0.1
    }
  })

  const color =
    intensity > 70 ? '#F87171' : intensity > 40 ? '#FBBF24' : '#34D399'

  return (
    <mesh ref={pulseRef} position={position}>
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.3}
        emissive={color}
        emissiveIntensity={0.8}
      />
    </mesh>
  )
}

// Energy flow lines around globe
export const EnergyStreams = ({ active = true }: { active?: boolean }) => {
  const streamsRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (streamsRef.current && active) {
      const time = state.clock.getElapsedTime()
      streamsRef.current.rotation.y = time * 0.3
      streamsRef.current.rotation.z = Math.sin(time * 0.5) * 0.1
    }
  })

  // Create orbital paths
  const streamCount = 3
  const streams = Array.from({ length: streamCount }, (_, i) => ({
    rotation: (i / streamCount) * Math.PI * 2,
    offset: i * 2,
  }))

  return (
    <group ref={streamsRef}>
      {streams.map((stream, i) => (
        <mesh key={i} rotation={[stream.rotation, 0, 0]}>
          <torusGeometry args={[2.8, 0.01, 8, 32]} />
          <meshBasicMaterial color="#55DDCA" transparent opacity={0.2} />
        </mesh>
      ))}
    </group>
  )
}

// Holographic grid overlay
export const HolographicGrid = ({ visible = true }: { visible?: boolean }) => {
  const gridRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (gridRef.current && visible) {
      const time = state.clock.getElapsedTime()
      gridRef.current.rotation.y = time * 0.05
      const material = gridRef.current.material as THREE.MeshBasicMaterial
      material.opacity = 0.15 + Math.sin(time * 0.8) * 0.05
    }
  })

  if (!visible) return null

  return (
    <mesh ref={gridRef}>
      <sphereGeometry args={[2.7, 32, 32]} />
      <meshBasicMaterial
        color="#55DDCA"
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  )
}

// Risk zone indicators (amber/red zones)
export const RiskZoneIndicator = ({
  position,
  riskLevel,
}: {
  position: [number, number, number]
  riskLevel: 'low' | 'medium' | 'high'
}) => {
  const indicatorRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (indicatorRef.current) {
      const time = state.clock.getElapsedTime()
      const speed = riskLevel === 'high' ? 2 : riskLevel === 'medium' ? 1.5 : 1
      indicatorRef.current.rotation.z = time * speed

      const material = indicatorRef.current.material as THREE.MeshStandardMaterial
      material.opacity = riskLevel === 'high' ? 0.6 : 0.4
    }
  })

  const color =
    riskLevel === 'high'
      ? '#F87171'
      : riskLevel === 'medium'
        ? '#FBBF24'
        : '#34D399'

  return (
    <mesh ref={indicatorRef} position={position}>
      <ringGeometry args={[0.2, 0.4, 16]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.4}
        emissive={color}
        emissiveIntensity={0.6}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// Particle field for ambient atmosphere
export const AmbientParticles = ({ count = 300 }: { count?: number }) => {
  const particlesRef = useRef<THREE.Points>(null)

  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 15
  }

  useFrame((state) => {
    if (particlesRef.current) {
      const time = state.clock.getElapsedTime()
      particlesRef.current.rotation.y = time * 0.01
      particlesRef.current.rotation.x = time * 0.005
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#55DDCA"
        transparent
        opacity={0.3}
        sizeAttenuation
      />
    </points>
  )
}

// Scan line effect for futuristic feel
export const ScanLine = ({ active = true }: { active?: boolean }) => {
  const scanRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (scanRef.current && active) {
      const time = state.clock.getElapsedTime()
      scanRef.current.position.y = Math.sin(time * 2) * 3

      const material = scanRef.current.material as THREE.MeshBasicMaterial
      const opacity = Math.abs(Math.sin(time * 2))
      material.opacity = opacity * 0.3
    }
  })

  if (!active) return null

  return (
    <mesh ref={scanRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[2, 2.8, 64]} />
      <meshBasicMaterial color="#55DDCA" transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  )
}
