import { CasperClient } from "casper-js-sdk";
import { getDeploy } from "../GetDeploy/GetDeploy";
import { NODE_ADDRESS } from "../NodeAddress/NodeAddress";

export async function putdeploy(signedDeploy) {
    // Dispatch deploy to node.
    const client = new CasperClient(NODE_ADDRESS);
    const installDeployHash = await client.putDeploy(signedDeploy);
    console.log(`... Contract installation deployHash: ${installDeployHash}`);
    const result = await getDeploy(NODE_ADDRESS, installDeployHash);
    console.log(`... Contract installed successfully.`, JSON.parse(JSON.stringify(result)));
    return result;
}