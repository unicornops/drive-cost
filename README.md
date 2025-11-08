# Fuel Cost Calculator

A modern single-page application for comparing journey costs between Diesel/Petrol and Electric vehicles.

## Features

- **Diesel/Petrol Calculator**: Calculate costs based on MPG, fuel price per litre, and gallon type (UK/US)
- **Electric Vehicle Calculator**: Calculate costs based on kWh per 100km and electricity price per kWh
- **Side-by-Side Comparison**: View both costs simultaneously with savings calculation
- **Flexible Units**: Input distance in miles or kilometers with automatic conversions
- **Real-time Calculations**: Costs update instantly as you enter values

## Getting Started

### Prerequisites

- Node.js (version 16 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository and navigate to the project directory:

```bash
cd electric-fuel-app
```

2. Install dependencies:

```bash
npm install
```

### Running the Development Server

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/` (or the next available port if 5173 is in use).

The development server includes:

- Hot Module Replacement (HMR) - changes are reflected instantly
- Fast refresh for Vue components
- Error overlay in the browser

### Building for Production

To create a production build:

```bash
npm run build
```

The optimized files will be generated in the `dist` directory.

To preview the production build locally:

```bash
npm run preview
```

## Technology Stack

- **Vue 3**: Progressive JavaScript framework with Composition API
- **Vite**: Next-generation frontend build tool
- **Tailwind CSS**: Utility-first CSS framework for styling
- **PostCSS**: CSS transformations and processing

## Usage

1. Enter the distance you plan to travel (in miles or kilometers)
2. Fill in the Diesel/Petrol vehicle details:
   - Miles per gallon (MPG)
   - Cost per litre of fuel
   - Select UK or US gallon type
3. Fill in the Electric vehicle details:
   - kWh consumption per 100km
   - Cost per kWh of electricity
4. View the calculated costs for both vehicle types and the comparison showing potential savings

## Learn More

- [Vue 3 Documentation](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
