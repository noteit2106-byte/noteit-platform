export interface Note {
  id: string;
  title: string;
  description: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  notes: Note[];
}

// Mock data for subjects and notes
export const subjects: Subject[] = [
  {
    id: '1',
    name: 'Computer Science',
    slug: 'computer-science',
    description: 'Foundational concepts and advanced topics in computer science',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
    notes: [
      {
        id: 'cs-1',
        title: 'Introduction to Algorithms',
        description: 'Basic concepts and examples of algorithms',
        content: `
# Introduction to Algorithms

## What is an Algorithm?

An algorithm is a step-by-step procedure for solving a problem or accomplishing a task. Algorithms are the foundation of computer science and are essential for creating efficient software.

## Key Properties of Algorithms

1. **Finiteness**: An algorithm must terminate after a finite number of steps.
2. **Definiteness**: Each step must be precisely defined.
3. **Input**: An algorithm takes zero or more inputs.
4. **Output**: An algorithm produces one or more outputs.
5. **Effectiveness**: Each step must be simple enough to be carried out by a human using pencil and paper.

## Complexity Analysis

- **Time Complexity**: How the running time increases with the input size
- **Space Complexity**: How much memory is required by the algorithm

## Common Algorithms

- Sorting algorithms (Bubble Sort, Merge Sort, Quick Sort)
- Searching algorithms (Linear Search, Binary Search)
- Graph algorithms (Breadth-First Search, Depth-First Search)
        `,
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-02-10T14:30:00Z',
      },
      {
        id: 'cs-2',
        title: 'Data Structures',
        description: 'Common data structures used in programming',
        content: `
# Data Structures

## What are Data Structures?

Data structures are specialized formats for organizing and storing data in computer systems. They provide different ways to access and manipulate data efficiently.

## Common Data Structures

### Arrays
- Fixed size collection of similar data types
- Elements accessed by index
- O(1) access time

### Linked Lists
- Sequence of nodes, each containing data and references to the next node
- Dynamic size
- O(n) access time

### Stacks
- LIFO (Last In, First Out) structure
- Push and Pop operations
- Common uses: Function calls, expression evaluation

### Queues
- FIFO (First In, First Out) structure
- Enqueue and Dequeue operations
- Common uses: Job scheduling, breadth-first search

### Trees
- Hierarchical data structure with nodes and edges
- Binary trees, AVL trees, B-trees
- Used for efficient searching and sorting

### Graphs
- Vertices connected by edges
- Used to represent networks and relationships
- Algorithms: BFS, DFS, Dijkstra's
        `,
        createdAt: '2025-02-01T09:15:00Z',
        updatedAt: '2025-03-05T16:20:00Z',
      },
    ],
  },
  {
    id: '2',
    name: 'Mathematics',
    slug: 'mathematics',
    description: 'Essential mathematical concepts for college students',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb',
    notes: [
      {
        id: 'math-1',
        title: 'Calculus Basics',
        description: 'Fundamental concepts of calculus',
        content: `
# Calculus Basics

## Introduction to Calculus

Calculus is the mathematical study of continuous change, just as geometry is the study of shape, and algebra is the study of generalizations of arithmetic operations.

## Limits

A limit is the value that a function approaches as the input approaches some value.

The notation: 
\`\`\`
lim(x→a) f(x) = L
\`\`\`

means that the limit of f(x) as x approaches a equals L.

## Derivatives

The derivative of a function represents the rate of change of the function with respect to an independent variable.

For a function f(x), the derivative is denoted as f'(x) or df/dx.

### Rules of Differentiation:

1. **Power Rule**: If f(x) = x^n, then f'(x) = nx^(n-1)
2. **Sum Rule**: (f + g)' = f' + g'
3. **Product Rule**: (fg)' = f'g + fg'
4. **Quotient Rule**: (f/g)' = (f'g - fg')/g^2
5. **Chain Rule**: (f(g(x)))' = f'(g(x)) · g'(x)

## Integrals

Integration is the reverse process of differentiation. It helps in finding the area under a curve.

The indefinite integral of f(x) is denoted as ∫f(x)dx.

### Basic Integration Rules:

1. ∫x^n dx = (x^(n+1))/(n+1) + C (where n ≠ -1)
2. ∫e^x dx = e^x + C
3. ∫sin(x) dx = -cos(x) + C
4. ∫cos(x) dx = sin(x) + C
        `,
        createdAt: '2025-01-20T11:30:00Z',
        updatedAt: '2025-02-15T13:45:00Z',
      },
    ],
  },
  {
    id: '3',
    name: 'Physics',
    slug: 'physics',
    description: 'Explore the laws that govern the natural world',
    imageUrl: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa',
    notes: [
      {
        id: 'phys-1',
        title: 'Classical Mechanics',
        description: 'Newton\'s laws and their applications',
        content: `
# Classical Mechanics

## Newton's Laws of Motion

### First Law (Law of Inertia)
An object at rest will remain at rest, and an object in motion will remain in motion with constant velocity, unless acted upon by a net external force.

### Second Law (F = ma)
The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass.

F = ma

Where:
- F is the net force (in Newtons)
- m is the mass of the object (in kilograms)
- a is the acceleration (in meters per second squared)

### Third Law (Action and Reaction)
For every action, there is an equal and opposite reaction.

## Work and Energy

### Work
Work is done when a force causes displacement. Mathematically:
W = F · d · cos(θ)

Where:
- W is work (in Joules)
- F is force (in Newtons)
- d is displacement (in meters)
- θ is the angle between the force and displacement vectors

### Kinetic Energy
The energy of motion: KE = (1/2)mv²

### Potential Energy
Energy due to position or configuration:
- Gravitational potential energy: PE = mgh
- Elastic potential energy: PE = (1/2)kx²

### Conservation of Energy
In an isolated system, the total energy remains constant.
        `,
        createdAt: '2025-02-05T14:20:00Z',
        updatedAt: '2025-03-10T09:35:00Z',
      },
    ],
  },
  {
    id: '4',
    name: 'Biology',
    slug: 'biology',
    description: 'Study of living organisms and their interactions',
    imageUrl: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8',
    notes: [
      {
        id: 'bio-1',
        title: 'Cell Biology',
        description: 'Structure and function of cells',
        content: `
# Cell Biology

## Cell Structure

The cell is the basic structural, functional, and biological unit of all known organisms. Cells are the smallest units of life.

### Prokaryotic Cells
- Simple structure without a true nucleus
- DNA is circular and found in the cytoplasm
- Examples: Bacteria and Archaea
- Components: Cell wall, cell membrane, cytoplasm, ribosomes, nucleoid

### Eukaryotic Cells
- More complex with membrane-bound organelles
- DNA is linear and contained within a nucleus
- Examples: Plants, animals, fungi, protists
- Major organelles:
  - **Nucleus**: Houses genetic material
  - **Mitochondria**: Powerhouse of the cell, produces ATP
  - **Endoplasmic Reticulum**: Protein synthesis and lipid metabolism
  - **Golgi Apparatus**: Modification and transport of proteins
  - **Lysosomes**: Digestive enzymes for cellular waste
  - **Chloroplasts**: Photosynthesis (in plant cells)

## Cell Membrane

The cell membrane is a selectively permeable barrier that separates the cell from the external environment.

### Fluid Mosaic Model
- Phospholipid bilayer with embedded proteins
- Hydrophilic heads face outward, hydrophobic tails face inward
- Proteins can be integral (embedded) or peripheral (attached to surface)

## Cell Division

### Mitosis
- Division of somatic cells
- Results in two genetically identical daughter cells
- Important for growth, repair, and asexual reproduction
- Phases: Prophase, Metaphase, Anaphase, Telophase

### Meiosis
- Division of germ cells to produce gametes
- Results in four haploid cells
- Involves genetic recombination
- Important for sexual reproduction and genetic diversity
        `,
        createdAt: '2025-01-25T08:45:00Z',
        updatedAt: '2025-02-20T15:30:00Z',
      },
    ],
  },
  {
    id: '5',
    name: 'Chemistry',
    slug: 'chemistry',
    description: 'Study of matter, its properties, and transformations',
    imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d',
    notes: [
      {
        id: 'chem-1',
        title: 'Organic Chemistry',
        description: 'Study of carbon-containing compounds',
        content: `
# Organic Chemistry

## Introduction to Organic Chemistry

Organic chemistry is the study of the structure, properties, composition, reactions, and preparation of carbon-containing compounds. These include hydrocarbons and their derivatives.

## Hydrocarbons

### Alkanes
- Saturated hydrocarbons with single bonds
- General formula: CnH2n+2
- Examples: methane (CH4), ethane (C2H6), propane (C3H8)
- Naming convention: -ane suffix

### Alkenes
- Unsaturated hydrocarbons with at least one double bond
- General formula: CnH2n
- Examples: ethene (C2H4), propene (C3H6)
- Naming convention: -ene suffix

### Alkynes
- Unsaturated hydrocarbons with at least one triple bond
- General formula: CnH2n-2
- Examples: ethyne/acetylene (C2H2), propyne (C3H4)
- Naming convention: -yne suffix

## Functional Groups

Functional groups are specific groups of atoms within molecules that are responsible for the characteristic chemical reactions of those molecules.

### Alcohols (-OH)
- Contain a hydroxyl group
- Examples: methanol (CH3OH), ethanol (C2H5OH)
- Naming convention: -ol suffix

### Aldehydes (-CHO)
- Contain a carbonyl group at the end of a carbon chain
- Examples: formaldehyde (HCHO), acetaldehyde (CH3CHO)
- Naming convention: -al suffix

### Ketones (>C=O)
- Contain a carbonyl group within a carbon chain
- Examples: acetone (CH3COCH3)
- Naming convention: -one suffix

### Carboxylic Acids (-COOH)
- Contain a carboxyl group
- Examples: formic acid (HCOOH), acetic acid (CH3COOH)
- Naming convention: -oic acid suffix

## Organic Reactions

### Substitution Reactions
- An atom or group is replaced by another atom or group
- Common in alkanes and aromatic compounds

### Addition Reactions
- Atoms or groups are added to a molecule with double or triple bonds
- Common in alkenes and alkynes

### Elimination Reactions
- Atoms or groups are removed, forming a multiple bond
- Example: dehydration of alcohols

### Oxidation-Reduction (Redox) Reactions
- Involve the transfer of electrons between species
- Example: oxidation of alcohols to aldehydes/ketones
        `,
        createdAt: '2025-03-01T13:10:00Z',
        updatedAt: '2025-04-05T10:25:00Z',
      },
    ],
  },
  {
    id: '6',
    name: 'Economics',
    slug: 'economics',
    description: 'Study of how societies allocate scarce resources',
    imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3',
    notes: [
      {
        id: 'econ-1',
        title: 'Microeconomics Principles',
        description: 'Study of individual economic units',
        content: `
# Microeconomics Principles

## Introduction to Microeconomics

Microeconomics is the study of how individuals, households, and firms make decisions to allocate limited resources. It focuses on the interactions between buyers and sellers and the factors that influence their choices.

## Supply and Demand

### Demand
Demand represents the quantity of a good that consumers are willing and able to purchase at various prices.

**Law of Demand**: As the price of a good increases, the quantity demanded decreases, assuming all other factors remain constant.

**Factors Affecting Demand**:
- Income
- Prices of related goods (substitutes and complements)
- Tastes and preferences
- Expectations
- Number of buyers

### Supply
Supply represents the quantity of a good that producers are willing and able to offer for sale at various prices.

**Law of Supply**: As the price of a good increases, the quantity supplied increases, assuming all other factors remain constant.

**Factors Affecting Supply**:
- Technology
- Input prices
- Expectations
- Number of sellers
- Taxes and subsidies

### Market Equilibrium
The point at which the quantity demanded equals the quantity supplied. At equilibrium:
- There is no shortage or surplus
- The market clears
- There is no pressure for price to change

## Elasticity

Elasticity measures the responsiveness of quantity demanded or supplied to changes in determinants like price.

### Price Elasticity of Demand (PED)
PED = (% Change in Quantity Demanded) / (% Change in Price)

- **Elastic** (PED > 1): Quantity demanded changes proportionally more than price
- **Inelastic** (PED < 1): Quantity demanded changes proportionally less than price
- **Unit Elastic** (PED = 1): Percentage changes are equal

### Income Elasticity of Demand
Measures how responsive demand is to changes in consumer income.

### Cross-Price Elasticity of Demand
Measures how responsive demand for one good is to price changes in another good.

## Market Structures

### Perfect Competition
- Many small firms
- Homogeneous products
- Price takers
- Free entry and exit
- Perfect information

### Monopolistic Competition
- Many small firms
- Differentiated products
- Some price-setting ability
- Free entry and exit

### Oligopoly
- Few large firms
- Interdependent decision making
- Significant barriers to entry
- Strategic behavior

### Monopoly
- Single seller
- Unique product with no close substitutes
- Significant barriers to entry
- Price setter
        `,
        createdAt: '2025-02-10T16:40:00Z',
        updatedAt: '2025-03-15T11:55:00Z',
      },
    ],
  },
];

export const getSubjectBySlug = (slug: string): Subject | undefined => {
  return subjects.find(subject => subject.slug === slug);
};

export const getNoteById = (noteId: string): { note: Note; subject: Subject } | undefined => {
  for (const subject of subjects) {
    const note = subject.notes.find(note => note.id === noteId);
    if (note) {
      return { note, subject };
    }
  }
  return undefined;
};