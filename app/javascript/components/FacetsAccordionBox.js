import React, { useState } from 'react';
import Button from 'react-bootstrap/lib/Button';

import FacetsAccordion from './FacetsAccordion';

/**
 * Component for containing accordion of facets shown upon clicking "More Filters"
 *
 * UI spec: https://projects.invisionapp.com/d/main#/console/19272801/402387756/preview
 *
 * TODO:
 *  - Handle APPLY, Clear
 *  - Add angle icons
 */
export default function FacetsAccordionBox(props) {

  // TODO: canSave interaction (SCP-2109)
  const [canSave, setCanSave] = useState(false);

  return (
    <div id='facets-accordion-box' style={{display: props.show ? '' : 'none'}}>
      <FacetsAccordion facets={props.facets} />
      {/*
      TODO: Abstract this and similar code block in
      FiltersBox into a new component (SCP-2109)
       */}
      <Button
        id='save-more-filters'
        className={'facet-save-button ' + (canSave ? 'enabled' : 'disabled')}
        // onClick={handleApplyClick}
        >
        APPLY
      </Button>
    </div>
  );
}
