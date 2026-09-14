import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const source = await readFile(new URL('../_worker.js', import.meta.url), 'utf8');
const worker = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

test('blocks the punctuation-obfuscated TRX promotion from the reported caption', () => {
  const caption = [
    '🔥转.U.仅.需.1.5.T.R.X.能.量',
    '💎免高额手续费,转U无忧!',
    '🔶市场汇率 USDT 兑换 TRX!',
    '🤖能量机器人: @DJTRX168_bot'
  ].join('\n');

  assert.equal(worker.isObviousAdvertisementText(caption), true);
});

test('does not block ordinary cryptocurrency questions', () => {
  assert.equal(worker.isObviousAdvertisementText('请问转账到 TRX 地址手续费是多少？'), false);
  assert.equal(worker.isObviousAdvertisementText('USDT 可以兑换 TRX 吗？'), false);
  assert.equal(worker.isObviousAdvertisementText('TRX 能量怎么获取？'), false);
});

test('preserves existing high-confidence promotion rules', () => {
  assert.equal(worker.isObviousAdvertisementText('代理加盟，加微信领取优惠'), true);
  assert.equal(worker.isObviousAdvertisementText('你好，我想咨询一下服务'), false);
});
