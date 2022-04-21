import axios from "axios";
import { DeployUtil } from 'casper-js-sdk';


export async function makeDeployWasm(publicKey, runtimeArgs, paymentAmount) {
    let wasmData = await axios.get('/getWasmData')
    console.log("wasmData.data.wasmData", wasmData.data.wasmData.data);
    console.log("new Uint8Array(wasmData.data.wasmData.data)", new Uint8Array(wasmData.data.wasmData.data));
    let deploy = DeployUtil.makeDeploy(
        new DeployUtil.DeployParams(
            publicKey,
            'casper-test'
        ),
        DeployUtil.ExecutableDeployItem.newModuleBytes(
            new Uint8Array(wasmData.data.wasmData.data),
            runtimeArgs
        ),
        DeployUtil.standardPayment(
            paymentAmount
        )
    );
    return deploy
}
