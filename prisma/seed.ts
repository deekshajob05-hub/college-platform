import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const colleges = [
    {
      name: "IIT Bombay",
      location: "Mumbai, Maharashtra",
      fees: 200000,
      rating: 4.8,
      overview: "One of the top engineering institutes in India, known for excellence in technology and research.",
      placements: "Average package 14 LPA, highest 80 LPA. Top recruiters: Microsoft, Oracle, Qualcomm.",
      courses: "B.Tech, M.Tech, MBA, PhD in Engineering and Sciences"
    }
  ];

  console.log("Seeding database...");
  
  for (const college of colleges) {
    await prisma.college.create({
      data: college,
    });
  }
  
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });