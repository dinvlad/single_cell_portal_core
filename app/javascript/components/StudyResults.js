import React, { useState, useEffect } from 'react'
import Tab from 'react-bootstrap/lib/Tab'
import Tabs from 'react-bootstrap/lib/Tabs'
import { useTable, usePagination } from 'react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons'

/**
 * Wrapper component for studies on homepage
 */
export default function StudyResultsContainer(props) {
  // const studies = <StudiesList studies={props.results}/>
  return (
    <Tab.Container id="result-tabs" defaultActiveKey="study">
      <Tabs defaultActiveKey='study' animation={false} >
        <Tab eventKey='study' title="Studies" >
          <StudiesResults changePage ={props.changePage} results={props.results}/>
        </Tab>
        <Tab eventKey='files' title='Files'></Tab>
      </Tabs>
    </Tab.Container>
  )
}

export const StudiesList = ({ studies }) => {
  return studies.studies.map(result => (
    {
      study: <Study
        study={result}
        key={result.accession}
        className='card'
      />,
    }
  ),
  )
}

/**
 * Component for the content of the 'Studies' tab
 */
export function StudiesResults(props) {
  const { results, changePage } = props
  const columns = React.useMemo(
    () => [{
      accessor: 'study',
    }])
  const data = results.studies.map(result => (
    {
      study: <Study
        terms={results.terms}
        facets = {results.facets}
        study={result}
        key={results.accession}
        className='card'
      />,
    }
  ),
  )
  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    rows,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex, pageSize },
  } = useTable({
    columns,
    data,
    // holds pagination states
    initialState: {
      pageIndex: (results.currentPage - 1),
      // This will change when there's a way to determine amount of results per page via API endpoint
      pageSize: 5,
    },
    pageCount: results.totalPages,
    manualPagination: true,
  },
  usePagination)
  return (
    <>
      <div className="row results-header">
        <div className="col-md-4 results-totals">
          <strong>{ results.totalStudies }</strong> total studies found
        </div>
        <div className="col-md-4">
          <PagingControl currentPage={results.currentPage}
            totalPages={results.totalPages}
            changePage={changePage}
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}/>
        </div>
      </div>
      <table {...getTableProps()}>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} className='result-row'>
                {row.cells.map(cell => {
                  return <td key {...cell.getCellProps()} id='result-cell'>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <PagingControl currentPage={results.currentPage}
        totalPages={results.totalPages}
        changePage={changePage}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}/>
    </>
  )
}
// Taken from https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/pagination
const PagingControl = ({ currentPage, totalPages, changePage, canPreviousPage, canNextPage }) => {
  return (
    <div className="pagination">
      <button
        className="text-button"
        onClick={() => {changePage(1)}}
        disabled={!canPreviousPage}>
        <FontAwesomeIcon icon={faAngleDoubleLeft}/>
      </button>
      <button
        className="text-button"
        onClick={() => {changePage(currentPage - 1)}}
        disabled={!canPreviousPage}>
        <FontAwesomeIcon icon={faAngleLeft}/>
      </button>
      <span className="currentPage">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="text-button"
        onClick={() => {changePage(currentPage + 1)}}
        disabled={!canNextPage}>
        <FontAwesomeIcon icon={faAngleRight}/>
      </button>
      <button
        className="text-button"
        onClick={() => {changePage(totalPages)}}
        disabled={!canNextPage}>
        <FontAwesomeIcon icon={faAngleDoubleRight}/>
      </button>
    </div>
  )
}

export const Study = study => {
  const { terms, facets } = study
  const [studyTitle, setStudyTitle] = useState()
  const [studyText, setStudyText] = useState()

  // eslint-disable-next-line require-jsdoc
  function highlightText(text) {
    if (terms || facets.length>0) {
      const searchTermIndex = text.indexOf(terms)
      if (searchTermIndex != -1) {
        return `${text.substring(0, searchTermIndex)}<span class='highlight'> ${text.substring(searchTermIndex, searchTermIndex+ terms.length)} </span> ${text.substring(searchTermIndex+ terms.length)}`
      }
    }
    return text
  }

  useEffect(() => {
    setStudyTitle(highlightText(study.study.name))
    setStudyText(highlightText(study.study.description))
  }, [])

  const displayedStudyDescription = { __html: studyText }
  const displayedStudyTitle= { __html: studyTitle }

  return (
    <div key={study.study.accession}>
      <label htmlFor={studyTitle} id= 'result-title'>
        <a href={study.study.study_url} dangerouslySetInnerHTML={displayedStudyTitle}></a></label>
      <div>
        <span id='cell-count' className='badge badge-secondary'>
          {study.study.cell_count} Cells
        </span>
      </div>
      <span
        disabled
        dangerouslySetInnerHTML={displayedStudyDescription}
        id='descrition-text-area'
        accession={study.study.accession}></span>
    </div>
  )
}
