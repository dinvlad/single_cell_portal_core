import React from 'react'
import { useTable, usePagination } from 'react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faAngleDoubleLeft, faAngleLeft, faAngleRight, faAngleDoubleRight
} from '@fortawesome/free-solid-svg-icons'

/**
 * Wrapper component for studies on homepage
 */
const StudyResults = ({ results, changePage }) => {
  const columns = React.useMemo(
    () => [{
      accessor: 'study'
    }])

  const data = results.studies.map(result => (
    {
      study: <Study
        study={result}
        key={result.accession}
        className='card'
      />
    }
  )
  )

  const {
    getTableProps,
    getTableBodyProps,
    prepareRow,
    rows,
    canPreviousPage,
    canNextPage
  } = useTable({
    columns,
    data,
    // holds pagination states
    initialState: {
      pageIndex: results.currentPage -1,
      // This will change when there's a way to determine amount of results
      // per page via API endpoint
      pageSize: 5
    },
    pageCount: results.totalPages,
    manualPagination: true
  },
  usePagination)
  return (
    <>
      <div className="row results-header">
        <div className="col-md-4 results-totals">
          <strong>{ results.totalStudies }</strong> total studies found
        </div>
        <div className="col-md-4">
          <PagingControl
            currentPage={results.currentPage}
            totalPages={results.totalPages}
            changePage={changePage}
            canPreviousPage={canPreviousPage}
            canNextPage={canNextPage}
          />
        </div>
      </div>
      <table {...getTableProps()}>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} className='result-row'>
                {row.cells.map(cell => {
                  return <td key {...cell.getCellProps()} id='result-cell'>{cell.render('Cell')}</td> // eslint-disable-line max-len
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <PagingControl
        currentPage={results.currentPage}
        totalPages={results.totalPages}
        changePage={changePage}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
      />
    </>
  )
}
// Taken from https://codesandbox.io/s/github/tannerlinsley/react-table/tree/master/examples/pagination
const PagingControl = ({
  currentPage, totalPages, changePage, canPreviousPage, canNextPage
}) => {
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

const Study = props => {
  const studyDescription = { __html: props.study.description }

  return (
    <div key={props.study.accession}>
      <label htmlFor={props.study.name} id= 'result-title'>
        <a href={props.study.study_url}>{props.study.name} </a></label>
      <div>
        <span id='cell-count' className='badge badge-secondary'>
          {props.study.cell_count} Cells
        </span>
      </div>
      <span
        disabled
        dangerouslySetInnerHTML={studyDescription}
        id='descrition-text-area'
        accession={props.study.name}></span>
    </div>
  )
}
export default StudyResults
