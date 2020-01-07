import createLnRpc, { LnRpc } from '@radar/lnrpc';
import env from './env';

export let node: LnRpc;

export async function initNode() {
  node = await createLnRpc({
    server: env.LND_GRPC_URL,
    cert: new (Buffer.from as any)(env.LND_TLS_CERT, 'base64').toString('ascii'),
    macaroon: new (Buffer.from as any)(env.LND_MACAROON, 'base64').toString('hex'),
  });
}
