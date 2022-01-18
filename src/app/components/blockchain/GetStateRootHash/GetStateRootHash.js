import { CasperServiceByJsonRPC } from "casper-js-sdk";

export const getStateRootHash = async (nodeAddress) => {
    const client = new CasperServiceByJsonRPC(nodeAddress);
    const { block } = await client.getLatestBlockInfo();
    if (block) {
        return block.header.state_root_hash;
    } else {
        throw Error("Problem when calling getLatestBlockInfo");
    }
};