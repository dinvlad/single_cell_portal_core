import React from 'react';
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";

/**
 * Component for a list of string-based filters, e.g. disease, species
 */
function FilterList(props) {
  if (typeof props.filters === 'undefined') return (<></>); // TODO: Remove this once /search/facets response is fixed
  return (
    <ul>
    {
      props.filters.map((filter) => {
        return (
          <li key={'li-' + filter.id}>
            <input
              type='checkbox'
              aria-label='checkbox'
              onClick={props.onClick}
              id={filter.id}
              name={filter.id}
            />
            <label htmlFor={filter.id}>{filter.name}</label>
          </li>
        );
      })
    }
    </ul>
  );
}

/**
 * Component for slider to filter numerical facets, e.g. organism age
 *
 * Stub, will develop.
 */
function FilterSlider(props) {
  const facet = props.facet;
  console.log('FacetSlider facet:')
  console.log(facet)
  // React Compound Slider
  // API: https://react-compound-slider.netlify.com/docs
  // Examples: https://react-compound-slider.netlify.com/horizontal
  return (
    <li>
      <Slider
        domain={[facet.min, facet.max]}
      />
    </li>
  );
}

/**
 * Component for filter list and filter slider
 */
export default function Filters(props) {
  const filters = props.filters;
  console.log('in Filters, props:')
  console.log(props)
  if (props.facet.type !== 'number') {
    return <FilterList filters={filters} onClick={props.onClick} />;
  } else {
    return <FilterSlider facet={props.facet} />;
  }
}
