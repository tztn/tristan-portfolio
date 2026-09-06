# Tristan Ray Portfolio — UI Design System Specification
> **Single Source of Truth (SSOT)** for Front-End Architecture, Design Tokens, Components, and Interaction Patterns.

---

## 1. Visual Identity & Aesthetic

### 1.1 Design Philosophy & Archetype
The user interface is engineered around an **Authentic CAD / Architectural Blueprint & Obsidian Minimalist** aesthetic (inspired by Chanh Dai and modern shadcn/ui engineering principles). It balances precision technical drafting aesthetics with tactile human craftsmanship.

Key hallmarks of this design archetype include:
- **Architectural Grid Paper Lines:** Continuous 1px technical lines spanning beyond viewport boundaries (`200vw`) to simulate blueprint schematics.
- **Hatched Diagonal Dividers:** Full-bleed striped banners generated via repeating linear gradients representing architectural structural sections.
- **Human Tactile Annotations:** Natural cursive marginalia (`Caveat` handwriting font paired with hand-drawn SVG doodle arrows) pointing inward toward key engineering feats, simulating hand annotations over printed CAD blueprints.
- **Hardware-Accelerated Tactile Feedback:** Integrated Web Audio API & `soundcn` acoustic micro-interactions (soft clicks, hover frequencies, modal chimes) synchronized with 60 FPS Lenis kinetic momentum scrolling and View Transitions API circular reveals.
- **High-Density Data Surfaces:** 2-column spec matrices, 4-column technical specification tables, 52-week contribution matrices, and a Unix CLI terminal console.

```
+-----------------------------------------------------------------------------------+
|  [TR] Monogram       Overview   Projects   Stack   About   Education   Contact    |
+===================================================================================+
|  [HATCHED STRIP BANNER] ////////////////////////////////////////////////////////  |
+-----------------------------------------------------------------------------------+
|  PROFILE HERO                                  [Free-standing Transparent Avatar] |
|  Tristan Ray Agoilo                            (No border, no frame, bottom-right)|
|  Modern web interfaces, built down to pixel                                       |
+-----------------------------------------------------------------------------------+
|  TECHNICAL SPEC MATRIX (2-Column CAD Grid)                                        |
|  [</>] Front-End Developer & UI Designer   | [Time] 06:15 PM // UTC+8             |
|  [*] BSIT Student @NCST                    | [Mail] agoilotristanray@gmail.com    |
|  [Pin] Dasmariñas City, Cavite, PH         |                                      |
+-----------------------------------------------------------------------------------+
|  SOCIAL ACTION BAR                                            --> [follow me ~]   |
|  [GitHub] [Discord] [Email]                                   (Handwritten Caveat)|
+-----------------------------------------------------------------------------------+
|  4-LAYER MOVING TECH MARQUEE (Continuous 30-38s linear loop, pause on hover)     |
+-----------------------------------------------------------------------------------+
```

### 1.2 The Full-Bleed Screen Line System
Unlike typical containerized designs that truncate dividers at container boundaries, this system implements **infinite architectural lines**:
- Horizontal divider rules extend **200vw** across the entire window (`width: 200vw; left: -100vw;`), maintaining continuous structural reference planes.
- Content is strictly constrained inside a centered 768px frame with vertical 1px left and right boundary borders (`border-left: 1px solid var(--border); border-right: 1px solid var(--border)`).

---

## 2. Color Palette & Token System

The color system uses CSS custom properties with automatic Dark/Light switching. The dark theme is built on an **Obsidian (#09090B)** foundation, while the light theme utilizes a clean architectural **Alabaster/Snow (#FFFFFF / #FAFAFA)** background with high-contrast slate borders.

### 2.1 Color Tokens Table

| Token Variable | Light Mode (HEX / RGBA) | Dark Mode (Obsidian) | Role & Usage |
| :--- | :--- | :--- | :--- |
| `--bg-primary` | `#FFFFFF` | `#09090B` | Document root background, main content backdrop |
| `--bg-secondary` | `#FAFAFA` | `#18181B` | Secondary panels, terminal titlebar, table sub-headers |
| `--bg-card` | `#FFFFFF` | `#121215` | Interactive cards, modal dialogs, pill chip backdrops |
| `--bg-card-hover`| `#F4F4F5` | `#18181B` | Card hover state, table row selection backdrop |
| `--text-primary` | `#09090B` | `#FAFAFA` | Primary headings, titles, high-contrast text |
| `--text-secondary`| `#52525B` | `#A1A1AA` | Body copy, narrative text, sub-headings |
| `--text-muted` | `#71717B` | `#71717B` | Captions, dates, spec labels, badge tags |
| `--border` | `#E4E4E7` | `#27272A` | Standard 1px CAD boundary lines, card borders |
| `--border-hover` | `#09090B` | `#FAFAFA` | Interactive element hover border |
| `--border-light` | `#F4F4F5` | `#1F1F23` | Subtle internal card separators |
| `--line` | `#E5E5E9` | `#222226` | Full-bleed screen lines (color-mix fallback) |
| `--stripe-color` | `rgba(228, 228, 231, 0.65)` | `rgba(39, 39, 42, 0.7)` | Diagonal hatched banner texture stripes |
| `--accent` | `#8E2235` (Burgundy) | `#D4485D` (Rose Crimson)| Highlights, interactive focus accents |
| `--accent-hover` | `#751B2B` | `#E35D72` | Hover state for accent buttons |
| `--accent-contrast`| `#FFFFFF` | `#09090B` | Foreground text when placed on accent background |
| `--emerald` | `#10B981` | `#10B981` | Online indicator, terminal status, live clocks |
| `--emerald-glow` | `rgba(16, 185, 129, 0.20)` | `rgba(16, 185, 129, 0.25)` | Pulsing radial halo for live status dots |

### 2.2 Functional & Third-Party System Colors

| Usage Category | Value (HEX / RGBA) | Context |
| :--- | :--- | :--- |
| **Error / Alert** | `#EF4444` | Form validation error text & border highlight |
| **Error Tint** | `rgba(239, 68, 68, 0.03)` | Input error background tint |
| **Terminal Close Dot** | `#FF5F56` (Glow: `rgba(255, 95, 86, 0.4)`) | Terminal window decoration |
| **Terminal Minimize** | `#FFBD2E` (Glow: `rgba(255, 189, 46, 0.4)`) | Terminal window decoration |
| **Terminal Expand** | `#27C93F` (Glow: `rgba(39, 201, 63, 0.4)`) | Terminal window decoration |
| **Terminal Path** | `#3B82F6` | Command line path indicator (`~`) |
| **Heatmap Empty** | Light: `#EBEDF0` / Dark: `#161B22` | GitHub contribution level 0 |
| **Heatmap Level 1** | Light: `#9BE9A8` / Dark: `#0E4429` | GitHub contribution level 1 |
| **Heatmap Level 2** | Light: `#40C463` / Dark: `#006D32` | GitHub contribution level 2 |
| **Heatmap Level 3** | Light: `#30A14E` / Dark: `#26A641` | GitHub contribution level 3 |
| **Heatmap Level 4** | Light: `#216E39` / Dark: `#39D353` | GitHub contribution level 4 |
| **Row Numbers** | Light: `#999999` / Dark: `#666666` | CAD table index indicators (`01`, `02`) |
| **Backdrop Blur** | `rgba(0, 0, 0, 0.45)` to `0.55` | CMDK overlay & Modal backdrops |

---

## 3. Typography Hierarchy

The typographic stack pairs clean geometric sans-serif type with high-legibility monospace fonts and playful handwritten cursive marginalia.

### 3.1 Font Families

```css
:root {
    /* Primary Display & Interface */
    --font-sans: 'Geist', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    
    /* Code, Terminal, Metadata, Navigation, Spec Matrices */
    --font-mono: 'Geist Mono', 'JetBrains Mono', monospace;
    
    /* Human Annotations, Marginal Notes, Arrows */
    --font-hand: 'Caveat', cursive;
    --font-handwriting: 'Caveat', cursive;
}
```

### 3.2 Type Scale & Applications

| Element / Class | Font Family | Size (rem / px) | Weight | Line Height | Tracking | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `.overview-profile-name` | `--font-sans` | `2.35rem` (37.6px) | 800 | `1.1` | `-0.035em` | Hero main name |
| `.sec-main-title` | `--font-sans` | `2.20rem` (35.2px) | 700 / 800 | `1.1` | `-0.02em` | Section primary title |
| `.proj-standalone-title-main` | `--font-sans` | `1.85rem` (29.6px) | 750 | `1.2` | `-0.03em` | Standalone article header |
| `.follow-hand-text` | `--font-hand` | `1.35rem` (21.6px) | 500 / 600 | `1.0` | Normal | Marginal cursive notes |
| `.brand-item-name` | `--font-sans` | `1.20rem` (19.2px) | 700 | `1.0` | `-0.025em`| Marquee ticker items |
| `.edu-school-name` | `--font-sans` | `1.05rem` (16.8px) | 700 | `1.35` | Normal | Academic institution |
| `.proj-lead-text` | `--font-sans` | `1.02rem` (16.3px) | 500 | `1.72` | Normal | Lead summary article text |
| `.project-card-title` | `--font-sans` | `1.00rem` (16.0px) | 600 | `1.38` | Normal | Projects grid card title |
| `.about-bio-pills p` | `--font-sans` | `0.93rem` (14.8px) | 400 | `1.72` | Normal | Narrative bio paragraphs |
| `.profile-tagline-mono` | `--font-mono` | `0.92rem` (14.7px) | 400 | `1.5` | Normal | Hero subtitle |
| `.proj-story-text` / `.proj-body-p` | `--font-sans` | `0.92rem` (14.7px) | 400 | `1.70` | Normal | Deep dive article story |
| `.contact-input` | `--font-sans` | `0.90rem` (14.4px) | 400 | `1.5` | Normal | Form inputs |
| `.cmdk-input` | `--font-sans` | `0.90rem` (14.4px) | 400 | `1.4` | Normal | CMDK command search |
| `.edu-bullet-list li` | `--font-sans` | `0.875rem` (14.0px)| 400 | `1.6` | Normal | Academic bullets |
| `.cmdk-item` | `--font-sans` | `0.84rem` (13.4px) | 400 | `1.4` | Normal | CMDK item title |
| `.meta-line-item` | `--font-mono` | `0.82rem` (13.1px) | 400 | `1.4` | Normal | Metadata grid spec line |
| `.header-nav-link` | `--font-mono` | `0.82rem` (13.1px) | 500 / 650 | `1.0` | Normal | Header navigation link |
| `.project-card-meta` | `--font-sans` | `0.82rem` (13.1px) | 400 | `1.4` | Normal | Date / classification |
| `.stack-pill-chip` / `.cad-pill-chip` | `--font-mono` | `0.8125rem` (13.0px)| 400 | `1.4` | Normal | Technical badge pills |
| `.terminal-body` / `.terminal-cli-input`| `--font-mono` | `0.8125rem` (13.0px)| 400 | `1.6` | Normal | Terminal HUD console |
| `.sec-badge-tag` | `--font-mono` | `0.75rem` (12.0px) | 600 | `1.0` | `0.10em` | Section tag uppercase |
| `.cmdk-footer` | `--font-mono` | `0.68rem` (10.9px) | 400 | `1.0` | Normal | Keyboard shortcut footer |
| `.cmdk-group-title` | `--font-mono` | `0.65rem` (10.4px) | 700 | `1.0` | `0.05em` | CMDK category section title |
| `.proj-spec-k` / `.b-label` | `--font-mono` | `0.62rem` (9.9px)  | 700 | `1.0` | `0.05em` | Table key uppercase |

---

## 4. Spacing, Layout & Grid Systems

### 4.1 Structural Constants
- **Header Height:** `--header-height: 56px;`
- **Max Content Container Width:** `--max-content-width: 768px;`
- **Root Page Wrapper Padding:** `padding: 0 16px 100px 16px;`

### 4.2 Spacing Scale
The layout adheres strictly to an 8-point base scale with 4px / 2px micro-increments:
- `2px` / `3px`: Heatmap gaps, inner keyboard badges, minimal icon gaps
- `4px`: Tag padding, small inline icon-to-label gaps, close buttons
- `6px`: Pill chip padding (vertical), CMDK list gaps, quick command chips
- `8px`: Standard button gaps, social bar spacing, metadata icon spacing
- `10px` / `12px`: CMDK item padding, navigation item gaps, card content padding
- `14px` / `16px`: Standard panel padding, input field padding, table headers
- `20px` / `24px`: Section padding, project card padding, timeline margins
- `28px` / `32px`: Overview hero profile padding, marquee brand item padding
- `56px`: Sticky header height
- `80px` / `100px`: Bottom page breathing space before footer

### 4.3 Grid & Flex Patterns

#### Pattern A: Centralized CAD Column (App Structure)
```css
.main-content {
    width: 100%;
    max-width: var(--max-content-width, 768px);
    margin: 0 auto;
    border-left: 1px solid var(--border);
    border-right: 1px solid var(--border);
    background-color: var(--bg-primary);
    display: flex;
    flex-direction: column;
    position: relative;
}
```

#### Pattern B: Technical Spec Matrix (2-Column Grid)
```css
.overview-metadata-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border-bottom: 1px solid var(--border);
}
@media (max-width: 640px) {
    .overview-metadata-grid { grid-template-columns: 1fr; }
}
```

#### Pattern C: Projects Showcase (2-Column Grid with Outer CAD Borders)
```css
.projects-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    border: 1px solid var(--border);
}
.project-craft-card {
    border-bottom: 1px solid var(--border);
    border-right: 1px solid var(--border);
}
.project-craft-card:nth-child(2n) {
    border-right: none;
}
@media (max-width: 640px) {
    .projects-grid { grid-template-columns: 1fr; }
    .project-craft-card { border-right: none !important; }
}
```

#### Pattern D: CAD Index Rows (Asymmetric Key-Value Table)
```css
.stack-table-row,
.cad-table-row {
    display: grid;
    grid-template-columns: 190px 1fr;
    border-bottom: 1px solid var(--border);
}
@media (max-width: 640px) {
    .stack-table-row,
    .cad-table-row {
        grid-template-columns: 1fr;
    }
}
```

#### Pattern E: Engineering Spec Matrix (4-Column Data Grid)
```css
.proj-spec-matrix {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background: var(--border);
    gap: 1px; /* 1px gap reveals border color between cells */
}
@media (max-width: 640px) {
    .proj-spec-matrix { grid-template-columns: repeat(2, 1fr); }
}
```

---

## 5. Borders, Radii & Architectural Linework

### 5.1 Corner Radii Scale

| Radius Token | Value | Applied To |
| :--- | :--- | :--- |
| **Square / None** | `0px` | Panels, profile row, avatar image, table rows, full-bleed lines |
| **Micro** | `2px` | GitHub contribution heatmap cells |
| **Subtle** | `3px` - `4px` | `<kbd>` elements, status badges, monogram tags |
| **Small** | `5px` - `6px` | Form inputs, social boxes, CMDK items, audio/theme buttons |
| **Medium** | `8px` | CMDK dialog, project modal dialog, education icon badges |
| **Card Wrap** | `12px` | Project image showcase media wrapper (`.project-media-wrap`) |
| **Full / Pill** | `9999px` | Filter pills, tech stack chips (`.stack-pill-chip`), action buttons |
| **Circle** | `50%` | Status dots, terminal macOS window controls |

### 5.2 Architectural Hatched Texture Banner
Hatched dividers symbolize CAD architectural drafts and blueprint section cuts:
```css
.sec-hatched-banner,
.stripe-divider {
    width: 100%;
    height: 32px;
    position: relative;
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
    background-color: var(--bg-primary);
}

.sec-hatched-banner::before {
    content: "";
    z-index: 0;
    width: 200vw;
    height: 100%;
    position: absolute;
    left: -100vw;
    top: 0;
    background-image: repeating-linear-gradient(
        315deg,
        var(--stripe-color) 0,
        var(--stripe-color) 1px,
        transparent 0,
        transparent 50%
    );
    background-size: 10px 10px;
    pointer-events: none;
}
```

---

## 6. Shadows, Transitions & Micro-Animations

### 6.1 Box Shadows & Halos
```css
/* Card Elevation */
--card-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.02);
--card-shadow-hover: 0 4px 16px rgba(0, 0, 0, 0.08);

/* Dark Mode Deep Shadow */
html.dark {
    --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    --card-shadow-hover: 0 8px 30px rgba(0, 0, 0, 0.7);
}

/* Floating Dialogs */
.cmdk-dialog { box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25); }
.modal-dialog { box-shadow: 0 24px 48px rgba(0, 0, 0, 0.30); }

/* Status Dot Glow */
.status-dot { box-shadow: 0 0 8px var(--emerald-glow); }
```

### 6.2 Timing & Easing Curves
The interface exclusively employs an ultra-snappy cubic bezier curve (`0.16, 1, 0.3, 1`) designed for low latency, high tactile satisfaction:
- **Fast Micro-interactions:** `var(--transition-fast): 0.15s cubic-bezier(0.16, 1, 0.3, 1);`
- **Medium Drawer / Accordions:** `var(--transition-medium): 0.25s cubic-bezier(0.16, 1, 0.3, 1);`
- **Spring Mechanical Toggles:** `cubic-bezier(0.34, 1.56, 0.64, 1)` (Theme icon rotations)
- **Theme Palette Fade:** `0.45s cubic-bezier(0.16, 1, 0.3, 1)`

### 6.3 60 FPS View Transitions (Circular Theme Reveal)
Theme toggling uses native View Transitions with GPU circular clip-path expansion centered on the user's click coordinate:
```javascript
const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
);
document.documentElement.animate(
    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`] },
    { duration: 480, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' }
);
```

### 6.4 Keyframe Animations

| Animation Name | Parameters | Target Element |
| :--- | :--- | :--- |
| `headerSlideDown` | `0.45s cubic-bezier(0.16, 1, 0.3, 1)` | Fixed top navigation header |
| `contentRevealUp` | `0.50s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both` | Main column container |
| `heroItemFadeUp` | `0.50s cubic-bezier(0.16, 1, 0.3, 1) staggered` | Hero identity, metadata, social row |
| `cmdk-in` | `0.15s cubic-bezier(0.16, 1, 0.3, 1)` | CMDK & Modal popover entrance |
| `marqueeScrollLeft`| `30s - 34s linear infinite` | Stack marquee Layer 1 & Layer 3 |
| `marqueeScrollRight`| `36s - 38s linear infinite` | Stack marquee Layer 2 & Layer 4 |
| `pulseDot` | `2.0s infinite ease-in-out` | Terminal & status green beacon |
| `termViewSwap` | `0.13s cubic-bezier(0.16, 1, 0.3, 1)` | Terminal single-view swap |

---

## 7. Component Patterns & Specifications

### 7.1 Tech Stack Pill Chips (`.stack-pill-chip`, `.cad-pill-chip`)
The fundamental micro-unit of technical taxonomy.
- **HTML Structure:**
  ```html
  <span class="stack-pill-chip">
      <span class="stack-chip-icon"><svg>...</svg></span>
      <span>JavaScript</span>
  </span>
  ```
- **Styling Rules:**
  - `padding: 4px 12px;`
  - `border-radius: 9999px;`
  - `border: 1px solid var(--border);`
  - `font-family: var(--font-mono);`
  - `font-size: 0.8125rem;`
  - `background-color: var(--bg-card);`
  - Hover: `border-color: var(--text-primary); transform: translateY(-1px); box-shadow: 0 2px 6px rgba(0,0,0,0.06);`

### 7.2 Project Craft Card (`.project-craft-card`)
- **Structure:** 16:9.5 aspect ratio media frame positioned above title and date.
- **Grayscale-to-Color Interaction:**
  - Default: `filter: grayscale(100%) contrast(0.92) opacity(0.8);`
  - Dark mode: `filter: grayscale(100%) contrast(0.9) brightness(0.85) opacity(0.75);`
  - Hover / Focus-visible: `filter: grayscale(0%) contrast(1) brightness(1) opacity(1); transform: scale(1.03);`
  - Media wrapper border changes to `var(--border-hover)`.

### 7.3 Interactive Terminal Console (`.terminal-hud-box`)
A simulation of a live Unix ZSH terminal environment.
- **Titlebar:** 3 macOS window buttons (red `#ff5f56`, yellow `#ffbd2e`, green `#27c93f`), center status text, pulsing emerald indicator.
- **Toolbar:** Categorized `.t-quick-chip` buttons (`help`, `projects`, `about`, `stack`, `skills`, `contact`, `whoami`, `time`, `clear`).
- **Screen View:** Fixed height `290px`, overflow auto, custom scrollbar.
- **Input Bar:** Active prompt label `visitor@tztn:~>` with caret color `var(--emerald)` and tab-completion.

### 7.4 Marginal Callout Annotations (`.callout-annotation`)
Human hand-drawn annotations overlaid onto the blueprint:
- Positioned absolutely in outside margins: `left: calc(100% + 14px)` or `right: calc(100% + 14px)`.
- Typography: `font-family: var(--font-handwriting); font-size: 1.35rem; color: var(--text-secondary);`.
- Rotated: `-3deg` to `+2.5deg`.
- Accompanied by inline SVG curved arrow pointing directly to the reference item.
- Media query: Hidden on screen widths `max-width: 1080px` to prevent viewport clipping.

### 7.5 Command Palette (`.cmdk-overlay`, `.cmdk-dialog`)
- Triggered by `Ctrl+K` / `Cmd+K` or clicking header trigger button.
- Width: `max-width: 580px`, backdrop blur `8px`.
- Instant search filtering across Navigation, Projects, Actions, and External URLs.
- Full arrow-key navigation (`ArrowUp`, `ArrowDown`, `Enter`, `Escape`).

### 7.6 Education Timeline Accordion (`.edu-card`)
- Vertical connecting tree line with smooth L-bend curve:
  ```css
  .edu-tree-line {
      position: absolute;
      top: 34px;
      left: 16px;
      width: 22px;
      height: calc(100% - 46px);
      border-left: 1.5px solid var(--border);
      border-bottom: 1.5px solid var(--border);
      border-bottom-left-radius: 8px;
  }
  ```
- Icon Badge: 34px × 34px with 8px radius holding SVG graduation cap.
- Smooth collapse: `max-height: 1000px` to `0px` with chevron 180° rotation.

---

## 8. Implementation Rules & Developer Guidelines

To maintain visual unity and avoid regressions, any future feature or component added to this codebase MUST follow these strict engineering rules:

### Rule 1: Zero Ad-Hoc Color Codes
- **NEVER** use raw hex codes (e.g. `#fff`, `#000`, `#333`, `#e5e7eb`) inside component CSS.
- **ALWAYS** reference design tokens: `var(--bg-primary)`, `var(--text-primary)`, `var(--border)`, `var(--emerald)`, etc.
- When transparency is needed, leverage `color-mix(in oklab, var(--token) X%, transparent)`.

### Rule 2: Strict Typography Separation
- Headings (`h1`, `h2`, `h3`) and descriptive narratives: **MUST** use `var(--font-sans)`.
- Data rows, numbers, time, tags, code snippets, buttons, navigation, and terminal text: **MUST** use `var(--font-mono)`.
- Marginal notes and personal callouts: **MUST** use `var(--font-handwriting)` (`Caveat`).

### Rule 3: Respect the 768px CAD Column & Full-Bleed Lines
- Primary UI elements must stay inside `max-width: var(--max-content-width, 768px);`.
- If a divider line is introduced, apply `.screen-line-top`, `.screen-line-bottom`, or a `::after` pseudo-element with `width: 200vw; left: -100vw;` to maintain continuous architectural planes.

### Rule 4: Always Support Both Theme Modes
- Test all components under `html` (Light) and `html.dark` (Obsidian).
- Ensure borders maintain 1px clarity in both modes (`#E4E4E7` in light vs `#27272A` in dark).
- Ensure images feature grayscale filter dampening in dark mode to preserve eye comfort.

### Rule 5: Tactile Audio & Kinetic Micro-Interactions
- Add interactive hover and click sound triggers for any new button or interactive control via `window.soundFX.play('click')` or `window.soundcn.playClickSoft()`.
- Register the selector in `attachSoundListeners()` inside `scripts/main.js`.
- Always verify that `data-lenis-prevent` is placed on scrollable overlay panels (such as CMDK list or Modal dialog) to prevent scroll chaining.

### Rule 6: Accessibility & Reduced Motion
- Respect user motion preferences:
  ```css
  @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
      }
  }
  ```
- Every icon-only button **MUST** include an explicit `aria-label` and `title`.

---

*This document represents the definitive UI specification for the Tristan Ray Portfolio codebase. Any structural or stylistic modifications should be recorded and versioned in this document.*
