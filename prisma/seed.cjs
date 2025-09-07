/* eslint-disable no-console */
const { PrismaClient } = require('../generated/prisma');

const prisma = new PrismaClient();

async function main() {
    await prisma.user.upsert({
        where: { email: 'admin@abyos.com' },
        update: {
            name: 'Admin',
            admin: true,
            password: '$2b$12$QGIn9v3C20O.9Ihd/tuB1e7NkbyIRByF3b5kM9v0Ny2kpOifAM17C',
            verified_at: new Date(),
        },
        create: {
            name: 'Admin',
            email: 'admin@abyos.com',
            admin: true,
            password: '$2b$12$QGIn9v3C20O.9Ihd/tuB1e7NkbyIRByF3b5kM9v0Ny2kpOifAM17C',
            verified_at: new Date(),
        },
    });

    console.log('Seed: admin user ensured.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

