# Saldoo MVP 1.0

A modern financial management application built with Next.js and shadcn/ui.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## Features

- Modern UI with shadcn/ui components
- Fully responsive design
- Dark mode support
- Customized brand colors (dark blue, white, black)
- Accessible components built on Radix UI primitives

## Available Components

The following shadcn/ui components are available in the project:

- Button
- Card
- Input
- Form (with Label)
- Dialog
- Dropdown Menu
- Avatar
- Navigation Menu
- Tooltip
- Table
- Tabs
- Toast
- Chart (placeholder)

All components can be imported from `@/components/ui`.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Component Usage

Import components from the `@/components/ui` directory:

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saldoo</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Actie</Button>
      </CardContent>
    </Card>
  );
}
```

## Customization

### Tailwind Configuration

The Tailwind configuration is in `tailwind.config.js`. Brand colors and other design tokens can be modified there.

### Global Styles

Global styles and CSS variables are defined in `src/app/globals.css`.

## Building for Production

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```