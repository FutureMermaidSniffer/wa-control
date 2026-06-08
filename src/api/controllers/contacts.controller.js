import contactsData from '../../data/contacts.data.js';

export async function listContacts(req, res, next) {
  try {
    const contacts = await contactsData.listContacts(req.query);
    res.json({ data: contacts });
  } catch (e) { next(e); }
}

export async function importContacts(req, res, next) {
  try {
    const { contacts = [], default_ws_account_id } = req.body;
    const results = await contactsData.importContacts(contacts, default_ws_account_id);
    res.status(201).json({ imported: results.length, results });
  } catch (e) { next(e); }
}
