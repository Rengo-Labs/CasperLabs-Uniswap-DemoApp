import { DeployUtil, Signer } from 'casper-js-sdk';
export async function signdeploywithcaspersigner(deploy, publicKeyHex) {
    let deployJSON = DeployUtil.deployToJson(deploy);
    console.log("deployJSON: ", deployJSON);
    let signedDeployJSON = await Signer.sign(deployJSON, publicKeyHex, publicKeyHex);
    console.log("signedDeployJSON: ", signedDeployJSON);
    let signedDeploy = DeployUtil.deployFromJson(signedDeployJSON).unwrap();

    console.log("signed deploy: ", signedDeploy);
    return signedDeploy;
}