import css from "./HomePage.module.less";
import { RefObject } from "react";
import * as React from "react";
import PageTransitionHelper from "../../helpers/PageTransitionHelper";
import { ReactPage } from "../../lib/solidify/react/ReactPage";
import { prepareComponent } from "../../helpers/prepareComponent";
import { Helmet } from "react-helmet-async";

interface IProps {
  classNames?: string[];

  // from store
  setcurrentPageName?: (pPageName: string) => void;
  currentPageName?: string;
}
interface IStates {}

// prepare
const { component, log } = prepareComponent("HomePage");

/**
 * @name HomePage
 */
class HomePage extends ReactPage<IProps, IStates> {
  // define ref
  protected rootRef: RefObject<HTMLDivElement>;

  /**
   * Constructor
   * @param pProps
   * @param pContext
   */
  constructor(pProps: IProps, pContext: any) {
    // relay
    super(pProps, pContext);
    // create ref
    this.rootRef = React.createRef();
  }

  // --------------------------------------------------------------------------- LIFE

  componentDidMount(): void {
    // set current page name in store
    this.props?.setcurrentPageName?.(component);
  }

  // --------------------------------------------------------------------------- TRANSITION

  /**
   * Action on this page.
   * Check props.action and props.parameters to show proper content.
   */
  action() {
    // Remove if not used
  }

  /**
   * Play in animation.
   * Call complete handler when animation is done.
   */
  protected playInHandler(pCompleteHandler: () => void) {
    return PageTransitionHelper.promisePlayIn(this.rootRef, pCompleteHandler);
  }

  /**
   * Play out animation.
   * Call complete handler when animation is done.
   */
  protected playOutHandler(pCompleteHandler: () => void) {
    return PageTransitionHelper.promisePlayOut(this.rootRef, pCompleteHandler);
  }

  // --------------------------------------------------------------------------- RENDER

  render() {
    return (
      <div className={css.HomePage} ref={this.rootRef}>
        <Helmet>
          <title>{component}</title>
        </Helmet>
        {component}
      </div>
    );
  }
}

export default HomePage;
