/**
 * A higher-order component that checks whether the named prop (which should be
 * a slice from the XB redux model) is ready; and if not, shows a spinner.
 *
 * A trigger function can be provided that is executed in the event that the slice
 * is neither ready nor fetching; which should trigger the appropriate fetching.
 *
 * Use this HOC to wrap high-level components that rely on the XB state being
 * available.
 */
import { connect } from "react-redux";
import { addControllersProp } from "../../model/controllers";

/**
 * wrapped: The component to wrap
 * propName: The name of the prop to test for loaded-ness
 * trigger: A function to run if the prop isn't loaded or loading
 */
const WithXBSlice = (Wrapped, propName, trigger) => {

  if(typeof propName == 'undefined') {
    throw "Must pass a propName to WithXBSlice()";
  }

  return function(props) {
    console.log("Render conditionally based on " + propName + " prop")

    const spinner = <ion-spinner name="crescent" />;

    if(typeof props[propName] == 'undefined') {
      console.error("prop", propName, "is not defined");
      return <>Error: prop {propName} is not defined.</>;
    } else if(typeof props[propName].fetching == 'undefined' || typeof props[propName].loaded == 'undefined') {
      console.error("prop", propName, "doesn't seem to be an XB slice");
        return <>Error: Prop doesn't seem to be an XB slice</>;
    } else if (!props[propName].fetching && !props[propName].loaded) {
      if(typeof trigger == 'undefined') {
        console.error("prop", propName, "is neither loaded nor fetching; you must trigger fetching manually or pass a trigger into WithXBSlice");
        return <>Error: slice {propName} is neither loaded nor fetching; you must trigger fetching manually or pass a trigger into WithXBSlice.</>;
      } else {
        console.log("WithXBSlice is triggering load using provided trigger");
        trigger(props);
        return spinner;
      }
    } else if(props[propName].fetching && !props[propName].loaded) {
      return spinner;
    } else {
      console.log("Slices are available; rendering");
      return <Wrapped {...props} />
    }
  }
}

export default WithXBSlice;
