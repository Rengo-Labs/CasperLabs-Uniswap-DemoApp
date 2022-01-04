import {
    CasperClient, CLAccountHash, CLByteArray, CLKey, CLList, CLPublicKey, CLValueBuilder, DeployUtil, RuntimeArgs, Signer
} from 'casper-js-sdk';
import { NODE_ADDRESS } from '../../../components/blockchain/NodeAddress/NodeAddress';

type RecipientType = CLPublicKey | CLAccountHash | CLByteArray;
function createRecipientAddress(recipient: RecipientType): CLKey {
    if (recipient instanceof CLPublicKey) {
        return new CLKey(new CLAccountHash(recipient.toAccountHash()));
    } else {
        return new CLKey(recipient);
    }
};

export async function pathMethod(amount_in, amount_out_min, path: string[], publicKey, deadline, caller, paymentAmount, publicKeyHex) {
    console.log('inner path',path);
    
    let _paths: CLKey[] = [];
    for (let i = 0; i < path.length; i++) {
        const p = new CLByteArray(Uint8Array.from(Buffer.from(path[i], "hex")));
        _paths.push(createRecipientAddress(p));
    }
    const runtimeArgs = RuntimeArgs.fromMap({
        amount_in: CLValueBuilder.u256(amount_in),
        amount_out_min: CLValueBuilder.u256(amount_out_min),
        path: new CLList(_paths),
        to: createRecipientAddress(publicKey),
        deadline: CLValueBuilder.u256(deadline),
    });

    let contractHashAsByteArray = Uint8Array.from(Buffer.from(caller, "hex"));
    let entryPoint = 'swap_exact_tokens_for_tokens_js_client';

    // Set contract installation deploy (unsigned).
    let deploy = await makeDeploy(publicKey, contractHashAsByteArray, entryPoint, runtimeArgs, paymentAmount)
    console.log("make deploy: ", deploy);
    // try {
    let signedDeploy = await signdeploywithcaspersigner(deploy, publicKeyHex)
    let result = await putdeploy(signedDeploy)
    console.log('result', result);
    // let variant = "success";
    // enqueueSnackbar('Tokens Swapped Successfully', { variant });
    // }
    // catch {
    //     let variant = "Error";
    //     enqueueSnackbar('User Canceled Signing', { variant });
    // }
    return _paths;
}
async function makeDeploy(publicKey, contractHashAsByteArray, entryPoint, runtimeArgs, paymentAmount) {
    let deploy = DeployUtil.makeDeploy(
        new DeployUtil.DeployParams(publicKey, 'casper-test'),
        DeployUtil.ExecutableDeployItem.newStoredContractByHash(
            contractHashAsByteArray,
            entryPoint,
            runtimeArgs
        ),
        DeployUtil.standardPayment(paymentAmount)
    );
    return deploy
}

async function signdeploywithcaspersigner(deploy, publicKeyHex) {
    let deployJSON = DeployUtil.deployToJson(deploy);
    console.log("deployJSON: ", deployJSON);
    console.log("publicKeyHex: ", publicKeyHex);
    let signedDeployJSON = await Signer.sign(deployJSON, publicKeyHex, publicKeyHex);
    let signedDeploy = DeployUtil.deployFromJson(signedDeployJSON).unwrap();

    console.log("signed deploy: ", signedDeploy);
    return signedDeploy;
}
async function putdeploy(signedDeploy) {
    // Dispatch deploy to node.
    const client = new CasperClient(NODE_ADDRESS);
    const installDeployHash = await client.putDeploy(signedDeploy);
    console.log(`... Contract installation deployHash: ${installDeployHash}`);
    const result = await getDeploy(NODE_ADDRESS, installDeployHash);
    console.log(`... Contract installed successfully.`, JSON.parse(JSON.stringify(result)));
    return result;
}
async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getDeploy(NODE_URL, deployHash) {
    const client = new CasperClient(NODE_URL);
    let i = 1000;
    while (i !== 0) {
        const [deploy, raw] = await client.getDeploy(deployHash);
        if (raw.execution_results.length !== 0) {
            // @ts-ignore
            if (raw.execution_results[0].result.Success) {

                return deploy;
            } else {
                // @ts-ignore
                throw Error("Contract execution: " + raw.execution_results[0].result.Failure.error_message);
            }
        } else {
            i--;
            await sleep(1000);
            continue;
        }
    }
    throw Error('Timeout after ' + i + 's. Something\'s wrong');
}