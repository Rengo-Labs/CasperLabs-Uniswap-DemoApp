import { CasperClient, CLPublicKey } from "casper-js-sdk";
import { getDeploy } from "../GetDeploy/GetDeploy";
import { NODE_ADDRESS } from "../NodeAddress/NodeAddress";
import axios from 'axios';

export async function putdeploy(signedDeploy, enqueueSnackbar) {
    // Dispatch deploy to node.
    const client = new CasperClient(NODE_ADDRESS);
    const installDeployHash = await client.putDeploy(signedDeploy);
    console.log(`... Contract installation deployHash: ${installDeployHash}`);
    const result = await getDeploy(NODE_ADDRESS, installDeployHash, enqueueSnackbar);
    console.log(`... Contract installed successfully.`, JSON.parse(JSON.stringify(result)));
    return installDeployHash;
}
export async function removeLiquidityPutDeploy(signedDeploy, enqueueSnackbar, activePublicKey) {
    // Dispatch deploy to node.
    const client = new CasperClient(NODE_ADDRESS);
    const installDeployHash = await client.putDeploy(signedDeploy);
    let param = {
        user: Buffer.from(
            CLPublicKey.fromHex(activePublicKey).toAccountHash()
        ).toString("hex"),
        deployHash: installDeployHash
    }
    console.log(`... Contract installation deployHash: ${installDeployHash}`);
    await axios
        .post("/setUserForRemoveLiquidityCSPR", param)
        .then(async (res) => {
            console.log('setUserForRemoveLiquidityCSPR', res);
            const result = await getDeploy(NODE_ADDRESS, installDeployHash, enqueueSnackbar);
            console.log(`... Contract installed successfully.`, JSON.parse(JSON.stringify(result)));
        }).catch((error) => {
            console.log(error);
            console.log(error.response);
        });

    return installDeployHash;
}