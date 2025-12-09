/**
 * Seed script for Erasmus Map application
 * This script populates the database with sample comments
 * and verifies that the university data is properly structured
 */

import { PrismaClient } from "@prisma/client";
import { getUniversityData } from "../lib/data";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed process...\n");

  // Verify university data
  console.log("📚 Verifying university data...");
  const universityData = getUniversityData();
  console.log(`✅ Found ${universityData.universities.length} Turkish universities`);
  
  let totalDepartments = 0;
  let totalPartners = 0;
  
  universityData.universities.forEach((uni) => {
    totalDepartments += uni.departments.length;
    uni.departments.forEach((dept) => {
      totalPartners += dept.partners.length;
    });
  });
  
  console.log(`✅ Total departments: ${totalDepartments}`);
  console.log(`✅ Total European partner universities: ${totalPartners}\n`);

  // Clear existing comments
  console.log("🗑️  Clearing existing comments...");
  await prisma.comment.deleteMany();
  console.log("✅ Cleared existing comments\n");

  // Seed sample comments
  console.log("💬 Seeding sample comments...");
  
  const sampleComments = [
    {
      universityId: "metu",
      name: "Ahmet",
      surname: "Yılmaz",
      email: "ahmet.yilmaz@example.com",
      content: "I spent a semester at TU Munich through METU's Computer Engineering program. It was an amazing experience! The courses were challenging and the city is beautiful.",
    },
    {
      universityId: "metu",
      name: "Elif",
      surname: "Kaya",
      email: "elif.kaya@example.com",
      content: "The Erasmus program at METU is very well organized. The international office helped me a lot with the application process.",
    },
    {
      universityId: "bogazici",
      name: "Mehmet",
      surname: "Demir",
      email: "mehmet.demir@example.com",
      content: "My time at ETH Zurich was incredible. I learned so much and made great connections. Highly recommend applying for Erasmus!",
    },
    {
      universityId: "bogazici",
      name: "Zeynep",
      surname: "Şahin",
      email: "zeynep.sahin@example.com",
      content: "Copenhagen Business School has excellent facilities and professors. The Danish education system is very different but in a good way.",
    },
    {
      universityId: "itu",
      name: "Can",
      surname: "Özdemir",
      email: "can.ozdemir@example.com",
      content: "Studying architecture at TU Delft was a dream come true. The studios are amazing and the Dutch approach to architecture is fascinating.",
    },
    {
      universityId: "bilkent",
      name: "Ayşe",
      surname: "Arslan",
      email: "ayse.arslan@example.com",
      content: "Sciences Po in Paris offered a unique perspective on international relations. The networking opportunities were invaluable.",
    },
    {
      universityId: "sabanci",
      name: "Emre",
      surname: "Kurt",
      email: "emre.kurt@example.com",
      content: "Karolinska Institute has world-class research facilities. I was able to participate in cutting-edge molecular biology research.",
    },
    {
      universityId: "koc",
      name: "Selin",
      surname: "Aydın",
      email: "selin.aydin@example.com",
      content: "The clinical training at Heidelberg University Hospital was exceptional. I learned techniques that I continue to use today.",
    },
    {
      universityId: "hacettepe",
      name: "Burak",
      surname: "Çelik",
      email: "burak.celik@example.com",
      content: "University of Vienna's pharmacy program is very comprehensive. The practical training in Austrian pharmacies was particularly useful.",
    },
    {
      universityId: "ege",
      name: "Deniz",
      surname: "Yıldız",
      email: "deniz.yildiz@example.com",
      content: "Wageningen University is the top agricultural university in Europe. The research opportunities there are unmatched.",
    },
  ];

  for (const comment of sampleComments) {
    await prisma.comment.create({
      data: comment,
    });
  }

  console.log(`✅ Created ${sampleComments.length} sample comments\n`);

  // Display summary
  console.log("📊 Seed Summary:");
  console.log("================");
  console.log(`Universities: ${universityData.universities.length}`);
  console.log(`Departments: ${totalDepartments}`);
  console.log(`Partner Universities: ${totalPartners}`);
  console.log(`Sample Comments: ${sampleComments.length}`);
  console.log("\n✨ Seed process completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed process:");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

