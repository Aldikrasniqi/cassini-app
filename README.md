# Terra Pulse

![Terra Pulse Interface](./Frame2.jpg)

**The Eye of Satellite** — A revolutionary satellite data visualization platform transforming how we understand and interact with Earth observation data.

---

## Project Overview

Terra Pulse is a cutting-edge web application that leverages real-time satellite data from European Space Agency (ESA) missions—Copernicus, Galileo, and EGNOS—to provide comprehensive environmental monitoring, health scoring, and predictive analytics. Built with modern web technologies and a focus on exceptional user experience, Terra Pulse makes complex satellite data accessible through intuitive, visually stunning interfaces.

### Mission Statement

**40% of deaths are preventable with better information systems.**

Terra Pulse addresses this critical need by delivering actionable environmental intelligence through an interface designed for clarity, speed, and reliability. Research from Nielsen Norman Group shows that emergency apps with poor UX have 60% lower action rates—Terra Pulse is engineered to be the exception.

---

## Core Goal: Leveraging Satellite Data

The primary objective of Terra Pulse is to harness the power of satellite data to provide real-time, actionable environmental intelligence. The application integrates data from multiple ESA satellite constellations:

### Data Sources

- **Copernicus Sentinel** — Earth observation satellites providing high-resolution imagery, atmospheric data, and environmental monitoring
- **Galileo** — European Global Navigation Satellite System (GNSS) providing precise positioning and timing data
- **EGNOS** — European Geostationary Navigation Overlay Service augmenting GPS/Galileo for enhanced accuracy

### Data Applications

1. **Environmental Health Monitoring** — Real-time assessment of air quality, pollution levels, and atmospheric conditions
2. **Weather Prediction** — 48-hour forward-looking forecasts based on satellite observations
3. **Safety Indexing** — Composite scoring system combining multiple environmental factors
4. **Crowd Density Analysis** — Population and activity monitoring for safety planning
5. **Truth Verification** — Comparison between curated imagery and raw satellite data

---

## Design Engineering

### Architecture Philosophy

Terra Pulse is built on a **mobile-first, performance-optimized architecture** that prioritizes:

- **Offline-First PWA** — Service worker implementation ensures core functionality without network connectivity
- **Progressive Enhancement** — Graceful degradation from 3D visualizations to 2D fallbacks
- **Real-Time Data Streaming** — Efficient WebSocket and polling strategies for live updates
- **Responsive Design** — Seamless experience across desktop, tablet, and mobile devices

### Technical Stack

#### Core Framework

- **Next.js 16** — React framework with App Router for optimal performance and SEO
- **React 19** — Latest React features including concurrent rendering and improved hooks
- **TypeScript 5** — Type-safe development with comprehensive type coverage

#### 3D Visualization

- **Three.js** — Core 3D graphics library
- **React Three Fiber** — React renderer for Three.js enabling declarative 3D scenes
- **@react-three/drei** — Helpful abstractions and utilities for R3F

#### Mapping & Geospatial

- **Mapbox GL** — High-performance vector maps with custom styling
- **Custom Map Layers** — Satellite imagery overlays and data visualization layers

#### UI/UX Framework

- **TailwindCSS 4** — Utility-first CSS framework with custom design system
- **Framer Motion** — Advanced animation library for smooth, performant transitions
- **Radix UI** — Accessible, unstyled component primitives
- **Lucide React** — Comprehensive icon library

#### State Management & Data

- **React Hooks** — Modern state management with `useState`, `useEffect`, and custom hooks
- **Real-Time Updates** — Interval-based polling with intelligent caching strategies

### Performance Optimizations

1. **Code Splitting** — Route-based and component-based lazy loading
2. **Image Optimization** — Next.js Image component with responsive sizing
3. **3D Scene Optimization** — Level-of-detail (LOD) systems and frustum culling
4. **Animation Performance** — GPU-accelerated transforms and `will-change` hints
5. **Bundle Size** — Tree-shaking and selective imports

### Accessibility

- **WCAG 2.1 AA Compliance** — Keyboard navigation, screen reader support, and ARIA labels
- **Touch Optimization** — Large touch targets (minimum 44x44px) and gesture support
- **Color Contrast** — High contrast ratios for text and interactive elements
- **Focus Management** — Visible focus indicators and logical tab order

---

## Product Design

### Interface Components

#### 1. Heartbeat Interface

**Purpose**: Real-time satellite health monitoring and mission status

**Features**:

- Organic heartbeat visualization with status-based pulse animations
- Mission telemetry display (temperature, radiation, atmosphere)
- Neural pathway connections between satellite nodes
- Emergency safing procedures and contact information
- Live status indicators for Copernicus, Galileo, and EGNOS missions

**Design Principles**:

- **Organic Motion** — Breathing animations that reflect system health
- **Status Color Coding** — Green (healthy), Amber (elevated), Red (danger)
- **Information Hierarchy** — Critical data prominently displayed
- **Spatial Awareness** — 3D positioning reflects orbital mechanics

#### 2. Satellite Vision Toggle

**Purpose**: Compare curated imagery with raw satellite truth

**Features**:

- Interactive slider revealing underlying satellite data
- Side-by-side comparison of tourist view vs. satellite reality
- Real-time pollution, cloud coverage, and temperature overlays
- Location navigation across multiple global points
- Copernicus Sentinel branding and data source attribution

**Design Principles**:

- **Transparency** — Visual metaphor of revealing truth
- **Data Overlay** — Non-intrusive information panels
- **Smooth Transitions** — Seamless slider interaction
- **Contextual Information** — Tooltips and detailed explanations

#### 3. 48-Hour Timeline

**Purpose**: Forward-looking environmental predictions

**Features**:

- Horizontal scrolling timeline with 48 data points
- Weather condition visualization (clear, cloudy, rain, storm, snow)
- Risk level indicators (safe, caution, danger)
- Temperature, wind speed, and radiation metrics
- Offline mode with cached prediction data
- Auto-scroll animation with manual control

**Design Principles**:

- **Temporal Flow** — Left-to-right progression through time
- **Visual Density** — Compact cards with expandable details
- **Status Communication** — Color-coded risk levels
- **Progressive Disclosure** — Detailed information on selection

#### 4. Destination Health Score™

**Purpose**: Composite environmental health assessment

**Features**:

- Interactive 3D globe with layered data visualization
- Weather, crowd density, and safety index layers
- Composite health score calculation (weighted algorithm)
- Real-time data updates with offline fallback
- Layer isolation controls for focused analysis
- Particle effects and atmospheric animations

**Design Principles**:

- **Spatial Understanding** — Globe representation for global context
- **Layer Abstraction** — Separate concerns (weather, crowd, safety)
- **Score Transparency** — Clear calculation methodology
- **Visual Feedback** — Animations reflect data changes

#### 5. Ghost Route Interface

**Purpose**: Historical route visualization and planning

**Features**:

- Map-based route display with waypoints
- Animated path rendering with flow effects
- Historical vs. planned route comparison
- Interactive waypoint markers
- Distance and time calculations

**Design Principles**:

- **Spatial Context** — Map-based visualization
- **Temporal Comparison** — Past vs. future routes
- **Minimalist Aesthetics** — Clean, uncluttered interface

### Design System

#### Color Palette

**Primary Colors**:

- **Deep Blue** (`#00597C`) — Primary brand color, represents depth and reliability
- **Aqua Glow** (`#55DDCA`) — Accent color, represents technology and innovation
- **Space Black** (`#000000`) — Background, represents space and depth
- **Space Navy** (`#0A1929`) — Secondary background, represents night sky

**Status Colors**:

- **Safe Green** (`#34D399`) — Healthy conditions, optimal status
- **Caution Yellow** (`#FBBF24`) — Moderate risk, elevated conditions
- **Danger Red** (`#F87171`) — Critical risk, immediate attention required

**Semantic Colors**:

- **White/Off-White** — Primary text and UI elements
- **Slate Grays** — Secondary text and backgrounds
- **Transparent Overlays** — Glassmorphism effects

#### Typography

- **Primary Font**: Geist Sans — Modern, readable sans-serif
- **Monospace Font**: Geist Mono — Technical data and timestamps
- **Font Sizes**: Responsive scale from 12px (mobile) to 48px (desktop headers)
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

#### Spacing System

- **Base Unit**: 4px
- **Scale**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px
- **Responsive Padding**: Safe area insets for mobile devices

#### Animation Principles

1. **Purpose-Driven** — Animations communicate state changes and data flow
2. **Performance-First** — GPU-accelerated transforms, 60fps target
3. **Organic Motion** — Easing functions that feel natural (cubic-bezier)
4. **Duration Guidelines**:
   - Micro-interactions: 150-300ms
   - State transitions: 300-500ms
   - Page transitions: 500-800ms
   - Loading states: 1-2s

#### Component Patterns

**Glassmorphism**:

- Backdrop blur effects (20-30px)
- Semi-transparent backgrounds (rgba with 0.1-0.3 opacity)
- Subtle borders (1px, rgba white 0.1-0.2)

**Card Design**:

- Rounded corners (12-24px radius)
- Elevated shadows (layered, colored shadows)
- Hover states (scale, glow, elevation)

**Button Patterns**:

- Primary: Solid background with hover glow
- Secondary: Outlined with transparent fill
- Icon buttons: Circular with backdrop blur
- Touch targets: Minimum 44x44px

---

## Frontend Architecture

### Project Structure

```
cassini-app/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Home page (TabNavigation)
│   ├── globals.css         # Global styles and animations
│   └── manifest.ts         # PWA manifest
├── components/
│   ├── pages/              # Feature components
│   │   ├── HeartbeatInterface.tsx
│   │   ├── SatelliteVisionToggle.tsx
│   │   ├── TimelineInterface.tsx
│   │   ├── HealthScoreInterface.tsx
│   │   ├── GhostRouteInterface.tsx
│   │   └── SimpleMapTest.tsx
│   ├── TabNavigation.tsx   # Main navigation component
│   └── ui/                  # Reusable UI components
│       └── button.tsx
├── lib/
│   └── utils.ts            # Utility functions (cn, etc.)
├── public/                 # Static assets
│   ├── icons/              # PWA icons
│   └── sw.js               # Service worker
└── package.json            # Dependencies
```

### Component Architecture

#### Component Hierarchy

```
TabNavigation (Root)
├── HeartbeatInterface
│   ├── OrganicHeartbeatOrb
│   ├── NeuralConnection
│   └── FuturisticDestinationCard
├── SatelliteVisionToggle
│   └── ComparisonSlider
├── TimelineInterface
│   ├── TimelinePoint
│   └── ForecastPanel
├── HealthScoreInterface
│   ├── Globe3D
│   ├── ScoreParticles
│   ├── HealthScoreDataPanel
│   └── HealthScoreEffects
└── GhostRouteInterface
    └── RouteMap
```

#### State Management Strategy

**Local State** (React Hooks):

- Component-specific UI state (`useState`)
- Real-time data polling (`useEffect` with intervals)
- Animation state (`useRef` for DOM references)

**Shared State** (Context API - if needed):

- User preferences
- Global settings
- Offline/online status

**Data Fetching**:

- Simulated real-time updates (intervals)
- Future: WebSocket connections for live data
- Caching strategy for offline mode

### Rendering Strategy

**Server-Side Rendering (SSR)**:

- Initial page load for SEO and performance
- Metadata and static content

**Client-Side Rendering (CSR)**:

- Interactive 3D scenes (Three.js requires browser APIs)
- Real-time data updates
- User interactions

**Static Generation (SSG)**:

- Landing pages
- Documentation
- Asset optimization

### Performance Optimizations

1. **Code Splitting**:

   - Route-based splitting (Next.js automatic)
   - Component lazy loading (`React.lazy`, `Suspense`)
   - 3D scene lazy loading

2. **Image Optimization**:

   - Next.js Image component
   - Responsive images with srcset
   - WebP format with fallbacks

3. **3D Scene Optimization**:

   - Geometry instancing for repeated objects
   - Texture compression
   - Frustum culling
   - Level-of-detail (LOD) systems

4. **Animation Performance**:

   - CSS transforms (GPU-accelerated)
   - `will-change` hints
   - `requestAnimationFrame` for JavaScript animations
   - Reduced motion support

5. **Bundle Optimization**:
   - Tree shaking
   - Selective imports (import only needed icons)
   - Dynamic imports for heavy dependencies

### PWA Implementation

**Service Worker** (`public/sw.js`):

- Offline caching strategy
- Asset precaching
- Background sync (future)

**Manifest** (`app/manifest.ts`):

- App metadata
- Icon definitions
- Theme colors
- Display mode (standalone)

**Offline Features**:

- Cached prediction data
- Offline indicator
- Graceful degradation

---

## Brand Identity

### Visual Identity

**Logo & Iconography**:

- Satellite dish and orbital ring motifs
- Geometric, technical aesthetic
- Minimalist, modern design

**Brand Colors**:

- Primary: Deep Blue (`#00597C`) — Trust, reliability, depth
- Accent: Aqua Glow (`#55DDCA`) — Innovation, technology, clarity
- Background: Space Black — Professional, focused, immersive

**Typography**:

- Geist Sans — Modern, approachable, technical
- Geist Mono — Data, precision, accuracy

### Brand Values

1. **Transparency** — Raw data over curated imagery
2. **Reliability** — Accurate, real-time information
3. **Accessibility** — Complex data made understandable
4. **Innovation** — Cutting-edge visualization technology
5. **Responsibility** — Environmental awareness and safety

### Tone of Voice

- **Professional** — Authoritative without being condescending
- **Clear** — Technical accuracy with plain language
- **Urgent** — When safety is at stake, clarity is critical
- **Inspiring** — Technology as a force for good

### User Experience Philosophy

**Clarity Over Cleverness**:

- Information hierarchy prioritizes critical data
- Visual design supports understanding, not decoration
- Interactions are intuitive and discoverable

**Performance as Feature**:

- Fast load times are non-negotiable
- Smooth animations enhance understanding
- Offline functionality ensures reliability

**Accessibility as Default**:

- WCAG 2.1 AA compliance
- Keyboard navigation throughout
- Screen reader support
- High contrast modes

**Mobile-First Thinking**:

- Touch-optimized interactions
- Responsive layouts
- Safe area support
- Gesture-friendly controls

---

## Development

### Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run mobile development server (with network access)
npm run dev:mobile

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

### Technology Decisions

**Why Next.js?**

- Server-side rendering for performance
- Built-in optimization (images, fonts, scripts)
- App Router for modern React patterns
- Excellent TypeScript support

**Why Three.js?**

- Industry-standard 3D library
- Extensive ecosystem
- Performance optimizations
- WebGL-based rendering

**Why TailwindCSS?**

- Rapid development
- Consistent design system
- Small bundle size (with purging)
- Excellent mobile-first utilities

**Why Framer Motion?**

- Declarative animation API
- Performance optimizations
- Gesture support
- Layout animations

---

## Future Enhancements

### Planned Features

1. **Real Data Integration**:

   - Copernicus Sentinel API integration
   - Galileo positioning data
   - EGNOS augmentation services

2. **Advanced Analytics**:

   - Historical data trends
   - Predictive modeling
   - Machine learning insights

3. **Social Features**:

   - Share health scores
   - Community reports
   - Collaborative planning

4. **Enhanced Mapping**:

   - 3D terrain visualization
   - Custom satellite layers
   - Route optimization

5. **Accessibility Improvements**:
   - Voice navigation
   - Haptic feedback
   - Enhanced screen reader support

---

## Contributing

This project is currently in active development. Contributions are welcome, particularly in:

- Performance optimizations
- Accessibility improvements
- Documentation enhancements
- Bug fixes and testing

---

## Acknowledgments

- **European Space Agency (ESA)** — For satellite data and mission information
- **Copernicus Programme** — Earth observation data
- **Galileo** — Navigation satellite system
- **EGNOS** — Satellite-based augmentation system

---

**Built with precision. Designed for clarity. Engineered for impact.**
