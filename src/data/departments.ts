// Types
export interface Note {
  id: string;
  title: string;
  description: string;
  content: string;
  fileType: 'markdown' | 'pdf' | 'doc' | 'docx' | 'ppt' | 'pptx' | 'image' | 'other';
  fileUrl?: string; // URL for external files
  fileExtension?: string; // Actual file extension
  isHandwritten?: boolean; // Flag for handwritten notes
  batch?: string; // Batch information (e.g., "2022-2023", "2023-2024")
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  name: string;
  slug: string;
  description: string;
  notes: Note[];
}

export interface Branch {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  subjects: Subject[];
}

export interface Department {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  branches: Branch[];
}

// Mock Data
export const departments: Department[] = [
  {
    id: 'dept-1',
    name: 'Engineering',
    slug: 'engineering',
    description: 'Study materials for various engineering disciplines',
    imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop',
    branches: [
      {
        id: 'branch-1',
        name: 'Computer Science',
        slug: 'computer-science',
        description: 'Resources for Computer Science and Engineering students',
        imageUrl: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=2074&auto=format&fit=crop',
        subjects: [
          {
            id: 'subject-1',
            name: 'Data Structures',
            slug: 'data-structures',
            description: 'Study materials for Data Structures and Algorithms',
            notes: [
              {
                id: 'note-1',
                title: 'Introduction to Data Structures',
                description: 'Fundamental concepts of data structures',
                content: `
# Introduction to Data Structures

## What are Data Structures?

Data structures are specialized formats for organizing, processing, retrieving and storing data. They provide a way to manage data efficiently and effectively, allowing for operations to be performed with optimal time complexity.

## Types of Data Structures

### 1. Arrays
- Fixed-size sequential collection of elements
- Access elements by index
- Time Complexity: Access O(1), Search O(n), Insert O(n), Delete O(n)

### 2. Linked Lists
- Linear collection of data elements, called nodes
- Each node points to the next node
- Time Complexity: Access O(n), Search O(n), Insert O(1), Delete O(1)

### 3. Stacks
- LIFO (Last In, First Out) principle
- Operations: push, pop, peek
- Time Complexity: Access O(n), Search O(n), Insert O(1), Delete O(1)

### 4. Queues
- FIFO (First In, First Out) principle
- Operations: enqueue, dequeue
- Time Complexity: Access O(n), Search O(n), Insert O(1), Delete O(1)

### 5. Trees
- Hierarchical data structure
- Root, parent, child, leaf nodes
- Time Complexity: Access O(log n), Search O(log n), Insert O(log n), Delete O(log n)

### 6. Graphs
- Nodes connected by edges
- Used to represent networks
- Time Complexity: depends on implementation
`,
                fileType: 'markdown',
                createdAt: '2023-10-15T12:00:00Z',
                updatedAt: '2023-11-05T14:30:00Z',
              },
              {
                id: 'note-2',
                title: 'Array Operations and Implementation',
                description: 'Detailed explanation of array operations and implementation techniques',
                content: `
# Array Operations and Implementation

## Basic Array Operations

### Initialization
\`\`\`java
// Java example
int[] array = new int[10];
int[] filledArray = {1, 2, 3, 4, 5};
\`\`\`

### Access
\`\`\`java
int element = array[index]; // O(1) time complexity
\`\`\`

### Insertion
\`\`\`java
// Insert at the end (assuming array has space)
array[size] = value; // O(1)

// Insert at specific position
for (int i = size; i > position; i--) {
    array[i] = array[i-1]; // Shift elements
}
array[position] = value; // O(n) time complexity
\`\`\`

### Deletion
\`\`\`java
// Delete from specific position
for (int i = position; i < size - 1; i++) {
    array[i] = array[i+1]; // Shift elements
}
size--; // O(n) time complexity
\`\`\`

## Array Types

1. **Static Arrays**: Fixed size, memory allocated during declaration
2. **Dynamic Arrays**: Size can be changed during execution (e.g., ArrayList in Java, vector in C++)

## Multi-dimensional Arrays

### 2D Arrays
\`\`\`java
int[][] matrix = new int[3][3]; // 3x3 matrix
matrix[0][0] = 1; // Access first element
\`\`\`

## Common Array Problems

1. **Traversal**: Visiting each element exactly once
2. **Searching**: Linear search (O(n)) vs Binary search (O(log n)) for sorted arrays
3. **Sorting**: Various algorithms (Bubble, Selection, Insertion, Merge, Quick)
4. **Rotation**: Moving elements of an array to left or right by certain positions
`,
                fileType: 'markdown',
                createdAt: '2023-10-20T09:45:00Z',
                updatedAt: '2023-11-10T11:20:00Z',
              }
            ]
          },
          {
            id: 'subject-2',
            name: 'Database Management Systems',
            slug: 'database-management-systems',
            description: 'Study materials for Database concepts and SQL',
            notes: [
              {
                id: 'note-3',
                title: 'Introduction to DBMS',
                description: 'Overview of database management systems',
                content: `
# Introduction to Database Management Systems (DBMS)

## What is a DBMS?

A Database Management System (DBMS) is software that allows users to define, create, maintain and control access to a database. It serves as an interface between the database and end users or application programs.

## Key Features of a DBMS

1. **Data Definition**: Allows users to define the structure and constraints of the data
2. **Data Manipulation**: Provides operations for updating, retrieving, and deleting data
3. **Data Security**: Controls access to data through authentication and authorization
4. **Data Integrity**: Ensures accuracy and consistency of data
5. **Concurrency Control**: Manages simultaneous access to data
6. **Transaction Management**: Maintains the ACID properties (Atomicity, Consistency, Isolation, Durability)
7. **Backup and Recovery**: Protects against data loss

## Types of Database Models

### 1. Hierarchical Model
- Data organized in a tree-like structure
- Parent-child relationship between records
- Example: IBM's Information Management System (IMS)

### 2. Network Model
- Data represented as records connected through links
- Allows many-to-many relationships
- Example: Integrated Data Store (IDS)

### 3. Relational Model
- Data organized in tables (relations) with rows and columns
- Based on relational algebra
- Examples: MySQL, PostgreSQL, Oracle, SQL Server

### 4. Object-Oriented Model
- Data represented as objects with attributes and methods
- Supports inheritance and encapsulation
- Examples: ObjectDB, Versant Object Database

### 5. NoSQL Model
- Designed for distributed data stores
- Types: Document stores, key-value stores, wide-column stores, graph databases
- Examples: MongoDB, Redis, Cassandra, Neo4j
`,
                fileType: 'markdown',
                createdAt: '2023-09-05T10:15:00Z',
                updatedAt: '2023-10-12T16:40:00Z',
              }
            ]
          }
        ]
      },
      {
        id: 'branch-2',
        name: 'Electrical Engineering',
        slug: 'electrical-engineering',
        description: 'Resources for Electrical and Electronics Engineering students',
        imageUrl: 'https://images.unsplash.com/photo-1620283085439-39620a1e21c4?q=80&w=2070&auto=format&fit=crop',
        subjects: [
          {
            id: 'subject-3',
            name: 'Circuit Theory',
            slug: 'circuit-theory',
            description: 'Study materials for Circuit Analysis and Design',
            notes: [
              {
                id: 'note-4',
                title: 'Fundamentals of Circuit Theory',
                description: 'Basic principles and laws of electrical circuits',
                content: `
# Fundamentals of Circuit Theory

## Basic Circuit Components

### 1. Resistors
- Passive components that oppose the flow of current
- Ohm's Law: V = IR, where V is voltage, I is current, and R is resistance
- Power dissipated: P = VI = I²R = V²/R
- Units: Ohms (Ω)

### 2. Capacitors
- Store energy in an electric field
- Relationship: Q = CV, where Q is charge, C is capacitance, V is voltage
- Impedance: Xc = 1/(2πfC), where f is frequency
- Units: Farads (F)

### 3. Inductors
- Store energy in a magnetic field
- Voltage-current relationship: V = L(di/dt)
- Impedance: XL = 2πfL
- Units: Henries (H)

## Fundamental Laws

### 1. Kirchhoff's Current Law (KCL)
- The sum of currents entering a node equals the sum of currents leaving the node
- ∑Iin = ∑Iout

### 2. Kirchhoff's Voltage Law (KVL)
- The sum of voltage drops around any closed loop is zero
- ∑V = 0

### 3. Ohm's Law
- V = IR
- Relates voltage, current, and resistance

## Circuit Analysis Techniques

### 1. Series and Parallel Circuits
- Series: Same current through all components, resistances add
- Parallel: Same voltage across all components, conductances add

### 2. Voltage and Current Division
- Voltage divider: Vout = Vin * (R2/(R1+R2))
- Current divider: I1 = Itotal * (R2/(R1+R2))

### 3. Node Voltage Analysis
- Assign voltages to nodes
- Apply KCL at each node
- Solve system of equations

### 4. Mesh Current Analysis
- Assign currents to meshes (loops)
- Apply KVL to each mesh
- Solve system of equations

### 5. Thévenin and Norton Equivalents
- Thévenin: Equivalent voltage source in series with equivalent resistance
- Norton: Equivalent current source in parallel with equivalent resistance
- Source transformation: Convert between Thévenin and Norton
`,
                createdAt: '2023-08-22T14:30:00Z',
                updatedAt: '2023-09-18T11:05:00Z',
              }
            ]
          }
        ]
      }
    ]
  }
];

// Helper Functions
export function getDepartmentBySlug(slug: string): Department | undefined {
  return departments.find((department) => department.slug === slug);
}

export function getBranchBySlug(departmentSlug: string, branchSlug: string): Branch | undefined {
  const department = getDepartmentBySlug(departmentSlug);
  return department?.branches.find((branch) => branch.slug === branchSlug);
}

export function getSubjectBySlug(departmentSlug: string, branchSlug: string, subjectSlug: string): Subject | undefined {
  const branch = getBranchBySlug(departmentSlug, branchSlug);
  return branch?.subjects.find((subject) => subject.slug === subjectSlug);
}

export function getNoteById(noteId: string): { 
  note: Note; 
  subject: Subject;
  branch: Branch;
  department: Department;
} | undefined {
  for (const department of departments) {
    for (const branch of department.branches) {
      for (const subject of branch.subjects) {
        const note = subject.notes.find((note) => note.id === noteId);
        if (note) {
          return { note, subject, branch, department };
        }
      }
    }
  }
  return undefined;
}