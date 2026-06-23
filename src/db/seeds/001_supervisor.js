import bcrypt from 'bcryptjs';

export async function seed(knex) {
  // Clean for dev seed
  await knex('role_permissions').del();
  await knex('permissions').del();
  await knex('users').del();

  // Basic permissions matching PDF ops (extend over time)
  const permissionKeys = [
    'accounts.manage', 'accounts.import', 'accounts.batch',
    'ports.purchase', 'ports.view',
    'warming.manage', 'warming.view',
    'desk.chat', 'desk.view',
    'blasts.fan', 'blasts.cold',
    'groups.pull', 'materials.manage',
    'contacts.manage', 'exports.run',
    'agents.manage',
  ];

  const permRows = permissionKeys.map((key) => ({
    key,
    group_name: key.split('.')[0],
    description: `Permission for ${key}`,
  }));

  const insertedPerms = await knex('permissions').insert(permRows).returning(['id', 'key']);

  // Supervisor gets all (we don't populate role_permissions strictly yet; middleware uses role)
  const password_hash = await bcrypt.hash('admin123', 12);

  await knex('users').insert({
    email: 'supervisor@local',
    password_hash,
    name: 'Supervisor',
    role: 'supervisor',
    is_active: true,
  });

  console.log('Seeded supervisor: supervisor@local / admin123 (CHANGE PASSWORD IMMEDIATELY)');
  console.log(`Seeded ${insertedPerms.length} permissions. Use requirePermission('accounts.manage') etc.`);

  // Default warming pool
  const existingPool = await knex('warming_pools').first();
  if (!existingPool) {
    await knex('warming_pools').insert({
      name: 'Default Warming Pool',
      mode: 'normal',
      target_days: 10,
      description: 'Standard warming pool per PDF',
    });
    console.log('Seeded default warming pool');
  }

  // Sample materials
  const matCount = await knex('materials').count('* as c').first();
  if (parseInt(matCount.c) === 0) {
    await knex('materials').insert([
      { type: 'nickname', name: 'WarmNick1', content: 'Alex Online' },
      { type: 'nickname', name: 'WarmNick2', content: 'Support Sam' },
      { type: 'message', name: 'Hello', content: 'Hello, how can I help you?' },
      { type: 'avatar', name: 'SampleAvatar', content: 'sample-avatar.jpg' }, // placeholder; real upload path would be used
    ]);
    console.log('Seeded sample materials');
  }
}
