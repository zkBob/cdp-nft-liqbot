import { BigNumber } from "ethers";

export const sqrt = (value: BigNumber) => {
    let x = BigNumber.from(1);
    let decreased = false;
    while (true) {
        let nx = x.add(value.div(x)).div(2);
        if (x.eq(nx) || (nx.gt(x) && decreased)) {
            break;
        }
        decreased = nx.lt(x);
        x = nx;
    }
    return x;
};
