export type ProjectVariant = 'fullstack' | 'cv' | 'algorithmic';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  variant: ProjectVariant;
  featured: boolean;
  image: string; // path to project image in /public
  video?: string; // path to demo video (CV variant)
  tags: string[];
  techStack: string[];
  accentColor: string; // hex color for hover border
  repoUrl?: string;
  demoUrl?: string;
}

export const projects: Project[] = [
  {
    id: 'live-analytics-platform',
    title: 'Live Analytics Platform',
    subtitle: 'Real-time dashboard for SaaS metrics',
    description:
      'A full-stack analytics platform processing 50k+ events/second with real-time WebSocket streaming. Built with a Node.js/Express backend handling event ingestion, Redis pub/sub for real-time fan-out, PostgreSQL for durable storage, and a React frontend with D3.js-powered interactive dashboards. Features include custom query builder, anomaly detection alerts, and multi-tenant data isolation.',
    variant: 'fullstack',
    featured: true,
    image: '/projects/analytics-platform.jpg',
    tags: ['React', 'Node.js', 'WebSocket', 'D3.js'],
    techStack: [
      'React 18',
      'Node.js / Express',
      'PostgreSQL',
      'Redis',
      'WebSocket',
      'D3.js',
      'Docker',
      'AWS ECS',
    ],
    accentColor: '#4A90D9',
    repoUrl: 'https://github.com',
    demoUrl: 'https://example.com',
  },
  {
    id: 'people-counter-cv',
    title: 'Real-Time People Counter',
    subtitle: 'YOLO + Kalman filter centroid tracking',
    description:
      'A production computer vision pipeline for real-time people counting in retail environments. Uses YOLOv8 for person detection, a custom centroid tracker with Kalman filter prediction for handling occlusions, and a crossing-line algorithm for directional counting. Achieves 94% accuracy at 30+ FPS on edge devices (Jetson Nano). The system feeds count data to a REST API for historical analytics and alerting.',
    variant: 'cv',
    featured: true,
    image: '/projects/people-counter.jpg',
    video: '/projects/people-counter-demo.mp4',
    tags: ['YOLOv8', 'OpenCV', 'Kalman Filter', 'Python'],
    techStack: [
      'Python',
      'YOLOv8 / Ultralytics',
      'OpenCV',
      'NumPy',
      'Kalman Filter',
      'NVIDIA Jetson',
      'FastAPI',
      'SQLite',
    ],
    accentColor: '#7B5EA7',
    repoUrl: 'https://github.com',
  },
  {
    id: 'ecommerce-microservices',
    title: 'E-Commerce Microservices',
    subtitle: 'Event-driven architecture at scale',
    description:
      'A distributed e-commerce platform built with microservices architecture. Services communicate via RabbitMQ event bus with CQRS pattern for order management. Includes inventory service with optimistic locking, payment gateway integration (Stripe), and a React storefront with server-side rendering. Handles 10k concurrent users with horizontal pod autoscaling on Kubernetes.',
    variant: 'fullstack',
    featured: false,
    image: '/projects/ecommerce.jpg',
    tags: ['Microservices', 'RabbitMQ', 'Kubernetes', 'React'],
    techStack: [
      'React / Next.js',
      'Node.js / Express',
      'MongoDB',
      'RabbitMQ',
      'Redis',
      'Stripe API',
      'Kubernetes',
      'Helm',
    ],
    accentColor: '#4A90D9',
    repoUrl: 'https://github.com',
  },
  {
    id: 'pde-fluid-solver',
    title: 'PDE Fluid Solver',
    subtitle: 'Navier-Stokes numerical simulation',
    description:
      'A numerical solver for the incompressible Navier-Stokes equations using finite difference methods on staggered grids. Implements Chorin\'s projection method for pressure-velocity coupling, with multigrid preconditioned conjugate gradient for the pressure Poisson equation. Includes WebGL visualization of velocity fields, vorticity, and streamlines. Benchmarked against lid-driven cavity flow at Re = 1000–10000.',
    variant: 'algorithmic',
    featured: false,
    image: '/projects/fluid-solver.jpg',
    tags: ['Navier-Stokes', 'Finite Difference', 'WebGL', 'C++'],
    techStack: [
      'C++ 20',
      'Eigen',
      'OpenMP',
      'WebAssembly',
      'WebGL 2.0',
      'TypeScript',
      'CMake',
    ],
    accentColor: '#7B5EA7',
    repoUrl: 'https://github.com',
    demoUrl: 'https://example.com',
  },
];
