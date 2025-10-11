// src/components/questions.js (FINAL)

export const questionPacks = [
  {
    packId: 1,
    equations: {
      1: { text: '2x+y+z=7' },    
      15: { text: 'x+y+2z=9' },   
      7: { text: '2x-y+z=3' } // <-- DIUBAH dari 6 jadi 7
    },
    answer: { x: 1, y: 2, z: 3 }
  },
  {
    packId: 2,
    equations: {
      1: { text: '2x+y+z=7' },   
      2: { text: '3x+2y+z=13' }, 
      8: { text: '2x+2y+z=12' }  
    },
    answer: { x: 1, y: 5, z: 0 }
  },
  {
    packId: 3,
    equations: {
      1: { text: '2x+y+z=7' }, 
      4: { text: 'x+y-z=2' },     
      2: { text: '3x+2y+z=13' }  
    },
    answer: { x: -3, y: 9, z: 4 }
  },
  {
    packId: 4,
    equations: {
      2: { text: '3x+2y+z=13' },
      3: { text: 'x+y+2z=10' },
      7: { text: '2x-y+z=3' } // <-- DIUBAH dari 6 jadi 7
    },
    answer: { x: 1.5, y: 2.833, z: 2.833 }
  },
  {
    packId: 5,
    equations: {
      4: { text: 'x+y-z=2' },
      8: { text: '2x+2y+z=12' },
      2: { text: '3x+2y+z=13' }
    },
    answer: { x: 1, y: 3.666, z: 2.666 }
  },
  {
    packId: 6,
    equations: {
      12: { text: 'x+2y+z=9' },
      1: { text: '2x+y+z=7' },   
      13: { text: '4x+y-z=10' }
    },
    answer: { x: 1.625, y: 3.625, z: 0.125 }
  },
  {
    packId: 7,
    equations: {
      7: { text: '2x-y+z=3' }, // <-- DIUBAH dari 6 jadi 7
      4: { text: 'x+y-z=2' },
      15: { text: 'x+y+2z=9' }   
    },
    answer: { x: 1.666, y: 2.666, z: 2.333 }
  },
  {
    packId: 8,
    equations: {
      3: { text: 'x+y+2z=10' },
      13: { text: '4x+y-z=10' },
      15: { text: 'x+y+2z=9' }   
    },
    answer: { x: 0.25, y: 9.25, z: 0.25 }
  },
  {
    packId: 9,
    equations: {
      1: { text: '2x+y+z=7' },   
      3: { text: 'x+y+2z=10' },
      8: { text: '2x+2y+z=12' }
    },
    answer: { x: -0.333, y: 5, z: 2.666 }
  },
  {
    packId: 10,
    equations: {
      2: { text: '3x+2y+z=13' },
      7: { text: '2x-y+z=3' }, // <-- DIUBAH dari 6 jadi 7
      15: { text: 'x+y+2z=9' }    
    },
    answer: { x: 1.75, y: 2.75, z: 2.25 }
  }
];