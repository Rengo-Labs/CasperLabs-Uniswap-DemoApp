import { DeployUtil } from 'casper-js-sdk';
export async function makeDeploy(publicKey, contractHashAsByteArray, entryPoint, runtimeArgs, paymentAmount) {
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
