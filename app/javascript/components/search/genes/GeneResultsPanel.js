import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDna, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'

import { GeneSearchContext } from 'providers/GeneSearchProvider'
import { StudyResults } from 'components/search/results/StudyResultsContainer'
import { PagingControl } from 'components/search/results/PagingControl'
import StudyGenes from './StudyGenes'

/**
 * Component for Results displayed on the homepage
 */
export default function GeneResultsPanel(props) {
  const searchContext = useContext(GeneSearchContext)
  const results = searchContext.results
  const studyResults = searchContext.studyResults
  let panelContent
  if (searchContext.isError) {
    panelContent =
      <div className="error-panel">
        <FontAwesomeIcon icon={faExclamationCircle}/>
        Sorry, an error has occurred.  Support has been notified.
        Please try again.
      </div>
  } else if (!searchContext.isLoaded) {
    panelContent =
      <div className="loading-panel">
        Loading &nbsp;
        <FontAwesomeIcon icon={faDna} className="gene-load-spinner"/>
      </div>
  } else if (studyResults.studies && studyResults.studies.length > 0) {
    panelContent =
      <>
        <StudyResults
          results={studyResults}
          changePage={pageNum => {searchContext.updateSearch({ genePage: pageNum })}}
          StudyComponent={ StudyGenes }
        />
      </>
  } else {
    panelContent = (<>
      <p>No results</p>
    </>)
  }
  return (
    <div className="results-panel">
      <div className="results-content">
        {panelContent}
      </div>
    </div>
  )
}


