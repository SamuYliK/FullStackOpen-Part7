import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  TableHead,
} from '@mui/material'

import { Link } from 'react-router-dom'

const Users = (users) => {
  const modifiedUsers = users.users

  return (
    <div>
      <h2 align="center">Users</h2>
      <TableContainer component={Paper}>
        <Table component="div">
          <TableHead component="div">
            <TableRow component="div">
              <TableCell component="div" align="center">
                <b>Username</b>
              </TableCell>
              <TableCell component="div" align="center">
                <b>blogs created</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody component="div">
            {modifiedUsers.map((user) => (
              <TableRow component="div" key={user.id}>
                <TableCell component={Link} to={`/users/${user.id}`}>
                  {user.username}
                </TableCell>
                <TableCell component="div">{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default Users
