import { CasperClient } from "casper-js-sdk";
import { sleep } from "../Sleep/Sleep";

export async function getDeploy(NODE_URL, deployHash) {
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