// Copyright (c) RoochNetwork
// SPDX-License-Identifier: Apache-2.0

// ** React Imports
import { useState, useEffect } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Card from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import Tooltip from '@mui/material/Tooltip'

// ** Store & Actions Imports
import { fetchData } from 'src/store/scan/transaction'
import { useAppDispatch, useAppSelector } from 'src/store'

// ** SDK Imports
import { TransactionResultView } from '@rooch/sdk'

// ** Utils
import { formatAddress } from 'src/@core/utils/format'

// ** Hooks
// import useClipboard from 'src/@core/hooks/useClipboard'
// import toast from "react-hot-toast";

interface CellType {
  row: TransactionResultView
}

// ** Styled components
const LinkStyled = styled(Link)(({ theme }) => ({
  fontSize: '1rem',
  textDecoration: 'none',
  color: theme.palette.primary.main,
}))

// ** renders client column

const defaultColumns: GridColDef[] = [
  {
    flex: 0.1,
    minWidth: 90,
    field: 'sequence_order',
    headerName: 'Sequence Order',
    renderCell: ({ row }: CellType) => (
      <Typography sx={{ color: 'text.secondary' }}>{row.sequence_info.tx_order}</Typography>
    ),
  },
  {
    flex: 0.1,
    field: 'tx_hash',
    minWidth: 80,
    headerName: 'Txn hash',
    renderCell: ({ row }: CellType) => (
      <LinkStyled href={`/scan/transaction/detail/${row.execution_info.tx_hash}`}>
        {formatAddress(row.execution_info.tx_hash)}
      </LinkStyled>
    ),
  },
  {
    flex: 0.1,
    field: 'method',
    minWidth: 80,
    headerName: 'Method',
    renderCell: ({ row }: CellType) => (
      <LinkStyled href="/">{row.transaction.action_type.toUpperCase()}</LinkStyled>
    ),
  },

  // {
  //   flex: 0.3,
  //   field: 'age',
  //   minWidth: 300,
  //   headerName: 'Age',
  //   renderCell: ({ row }: CellType) => <LinkStyled href="/">{row.transaction.}</LinkStyled>,
  // },
  {
    flex: 0.2,
    minWidth: 125,
    field: 'sender',
    headerName: 'Sender',
    renderCell: ({ row }: CellType) => (
      <Tooltip placement="bottom" sx={{ cursor: 'pointer' }} title={row.transaction.sender}>
        <Typography sx={{ color: 'text.secondary' }}>
          {formatAddress(row.transaction.sender)}
        </Typography>
        {/*<LinkStyled href="/" onClick={ (event) => {*/}
        {/*    event.preventDefault()*/}
        {/*TODO: copy */}
        {/*}}>{formatAddress(row.transaction.sender)}</LinkStyled>*/}
      </Tooltip>
    ),
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'status',
    headerName: 'Status',
    renderCell: ({ row }: CellType) => (
      <Typography sx={{ color: 'text.secondary' }}>
        {row.execution_info.status.type.toUpperCase()}
      </Typography>
    ),
  },
  {
    flex: 0.1,
    minWidth: 90,
    field: 'txn-fee',
    headerName: 'Txn Fee',
    renderCell: ({ row }: CellType) => (
      <Typography sx={{ color: 'text.secondary' }}>{row.execution_info.gas_used}</Typography>
    ),
  },
]

const TransactionList = () => {
  // ** State
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })

  // ** Hooks
  const dispatch = useAppDispatch()
  const { result, status } = useAppSelector((state) => state.transaction)

  // const clipboard = useClipboard()

  useEffect(() => {
    // Ignore part of request
    if ((!result.has_next_page && status === 'finished') || status === 'loading') {
      return
    }

    dispatch(
      fetchData({
        cursor: paginationModel.page * paginationModel.pageSize,
        limit: paginationModel.pageSize,
        dispatch,
      }),
    )
  }, [dispatch, paginationModel, result, status])

  return (
    <Card>
      <DataGrid
        autoHeight
        pagination
        disableColumnMenu={true}
        rows={
          status === 'finished'
            ? result.data.map((row) => ({ ...row, id: row.execution_info.tx_hash }))
            : []
        }
        loading={status === ('loading' as 'loading')}
        columns={defaultColumns.map((v) => ({
          ...v,
          sortable: false,
        }))}
        pageSizeOptions={[10, 25, 50]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
    </Card>
  )
}

export default TransactionList