import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  extractPeer,
  isLidJid,
  isPhoneJid,
  jidUser,
  looksLikeLidDigits,
} from '../src/utils/wa-jid.js';

describe('wa-jid helpers', () => {
  it('detects lid/phone jids', () => {
    assert.equal(isLidJid('253914339312345@lid'), true);
    assert.equal(isPhoneJid('254712345678@s.whatsapp.net'), true);
    assert.equal(jidUser('254712345678:12@s.whatsapp.net'), '254712345678');
    assert.equal(looksLikeLidDigits('253914339312345'), true);
    assert.equal(looksLikeLidDigits('254712345678'), false);
  });

  it('extractPeer prefers senderPn over @lid remote', () => {
    const peer = extractPeer({
      key: {
        remoteJid: '253914339312345@lid',
        fromMe: false,
        id: 'ABC',
        senderPn: '254712345678@s.whatsapp.net',
      },
      pushName: 'Alice',
      message: { conversation: 'hi' },
    });
    assert.equal(peer.phone, '254712345678');
    assert.equal(peer.lid, '253914339312345');
    assert.equal(peer.isLid, false);
    assert.equal(peer.sendJid, '254712345678@s.whatsapp.net');
    assert.equal(peer.displayId, '+254712345678');
  });

  it('extractPeer falls back to LID when no PN', () => {
    const peer = extractPeer({
      key: {
        remoteJid: '253914339312345@lid',
        fromMe: false,
        id: 'ABC',
      },
      pushName: 'Bob',
    });
    assert.equal(peer.phone, null);
    assert.equal(peer.lid, '253914339312345');
    assert.equal(peer.isLid, true);
    assert.equal(peer.sendJid, '253914339312345@lid');
    assert.equal(peer.displayId, 'Bob');
  });

  it('extractPeer handles phone-only remote', () => {
    const peer = extractPeer({
      key: {
        remoteJid: '254712345678@s.whatsapp.net',
        fromMe: false,
        id: 'X',
      },
    });
    assert.equal(peer.phone, '254712345678');
    assert.equal(peer.isLid, false);
  });
});
