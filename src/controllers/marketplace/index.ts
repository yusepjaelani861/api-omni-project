import StoreController from "./store";
import TokopediaController from "./tokopedia";

class MarketplaceController {
  public tokopedia = new TokopediaController()
  public store = new StoreController()
}

export default MarketplaceController