import React, { useContext } from 'react'
import _isEqual from 'lodash/isEqual'
import Button from 'react-bootstrap/lib/Button'

import { StudySearchContext } from 'components/search/StudySearchProvider'
import Filters from './Filters'
import _remove from 'lodash/remove'

/**
 * Component that can be clicked to unselect filters
 */
function ClearFilters(props) {
  return (
    <span
      id={`clear-filters-${props.facetId}`}
      className='clear-filters'
      onClick={props.onClick}
    >
      CLEAR
    </span>
  )
}

/**
 * Component for the "APPLY" button that can be clicked it to save selected
 * filters for the current facet or facet accordion.
 */
function ApplyButton(props) {
  return (
    <Button
      id={props.id}
      bsStyle='primary'
      className={props.className}
      onClick={props.onClick}
    >
    APPLY
    </Button>
  )
}

/**
 * Component for filter lists that have Apply and Clear
 */
export default function FiltersBox(props) {
  const searchContext = useContext(StudySearchContext)

  let appliedSelection = searchContext.params.facets[props.facet.id]
  appliedSelection = appliedSelection ? appliedSelection : []
  const selection = props.selection
  const setSelection = props.setSelection
  const showClear = selection.length > 0
  const canApply = !_isEqual(selection, appliedSelection)

  // TODO: Get opinions, perhaps move to a UI code style guide.
  //
  // Systematic, predictable IDs help UX research and UI development.
  //
  // Form of IDs: <general name> <specific name(s)>
  // General name: All lowercase, specified in app code (e.g. 'apply-facet')
  // Specific name(s): Cased as specified in API (e.g. 'NCBITaxon_9606')
  //
  // UI code concatenates names in the ID.  Names in ID are hyphen-delimited.
  //
  // Examples:
  //   * apply-facet-species (for calls-to-action use ID: <action> <component>)
  //   * filter-species-NCBITaxon_9606
  const facetId = props.facet.id
  const componentName = 'filters-box'
  const filtersBoxId = `${componentName}-${facetId}`
  const applyId = `apply-${filtersBoxId}`

  function updateSelectionForFilterCheckboxes(filterId, value) {
    const newSelection = selection.slice()
    if (value && !newSelection.includes(filterId)) {
      newSelection.push(filterId)
    }
    if (!value) {
      _remove(newSelection, id => {return id === filterId})
    }
    setSelection(newSelection)
  }

  function updateSelectionForFilterSlider(ranges) {
    let newSelection = selection.slice()
    if (!newSelection !== [ranges]) {
      newSelection = [ranges]
    }
    setSelection(newSelection)
  }

  function handleApplyClick(event) {
    if (!canApply) return

    const updatedFacetValue = {}
    updatedFacetValue[facetId] = selection
    searchContext.updateSearch({ facets: updatedFacetValue })
    if (props.setShow) {
      props.setShow(false)
    }
  }

  function clearFilters() {
    setSelection([])
  }

  return (
    <div id={filtersBoxId}>
      <Filters
        facet={props.facet}
        filters={props.filters}
        updateSelectionForFilterCheckboxes={updateSelectionForFilterCheckboxes}
        updateSelectionForFilterSlider={updateSelectionForFilterSlider}
        selection={selection}
      />
      <div className='filters-box-footer'>
        {showClear &&
        <ClearFilters
          facetId={props.facet.id}
          onClick={clearFilters}
        />
        }
        <ApplyButton
          id={applyId}
          className={`facet-apply-button ${canApply ? 'active' : 'disabled'}`}
          onClick={handleApplyClick}
        />
      </div>
    </div>
  )
}