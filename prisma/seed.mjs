import { PrismaClient } from '@prisma/client'; import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function main(){
  const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
  await prisma.user.upsert({ where:{ email: process.env.ADMIN_EMAIL || 'admin@studio.test' }, update:{}, create:{ email: process.env.ADMIN_EMAIL || 'admin@studio.test', passwordHash: hash, role:'ADMIN' } });
  const cat = await prisma.serviceCategory.upsert({ where:{ id:'default-cat' }, update:{}, create:{ id:'default-cat', name:'Mariage' } });
  const svc = await prisma.service.create({ data:{ name:'Reportage Mariage', categoryId: cat.id } });
  await prisma.servicePlan.createMany({ data:[
    { serviceId: svc.id, name:'Formule Découverte', description:'4h de couverture', durationMinutes:240, priceCents:60000 },
    { serviceId: svc.id, name:'Formule Classique', description:'8h de couverture', durationMinutes:480, priceCents:120000 },
    { serviceId: svc.id, name:'Formule Premium', description:'12h + album', durationMinutes:720, priceCents:180000 },
  ]});
  await prisma.gallery.create({ data:{ title:'Exemple Mariage', type:'MARIAGE', clientName:'Camille & Alex', clientEmail:'camille.alex@example.com', token:'token-demo', guestToken:'guesttoken-demo', clientRequireCode:true, clientAccessCode:'CAMILLEX', guestRequireCode:true, guestAccessCode:'INVITES2025' } });
  console.log('Seed OK');
}
main().finally(()=>prisma.$disconnect());
