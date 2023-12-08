import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const MENU_STYLES = {
  color: 'white',
  bgcolor:'transparent',
  border:'none',
  paddingX:'5px',
  borderRadius:'4px',
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

const Boardbar = () => {
  return (
    <Box px={2} sx={{
      width:'100%',
      height:(theme) => theme.trello.boardBarHeight,
      display:'flex',
      alignItems:'center',
      justifyContent:'space-between',
      gap: 2,
      overflowX: 'auto',
      borderBottom: '1px solid white',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '##4495e' : '#1976d2'),
      '&::-webkit-scrollbar-track': { m: 1 }
    }}>

      <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>

        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label="Nguyen Quang Huy MERN Stack Board"
          onClick={() => {}}
        />

        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label="Public/Private Workspace"
          onClick={() => {}}
        />

        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          onClick={() => {}}
        />

        <Chip
          sx={MENU_STYLES}
          icon={<ElectricBoltIcon />}
          label="Automation"
          onClick={() => {}}
        />

        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filter"
          onClick={() => {}}
        />

      </Box>

      <Box sx={{ display:'flex', alignItems:'center', gap:2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Invite
        </Button>

        <AvatarGroup
          max={4}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize:16,
              border:'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
        >
          <Tooltip title="Nguyen Quang Huy">
            <Avatar alt="Nguyen Quang Huy" src="/static/images/avatar/1.jpg" />
          </Tooltip>
        </AvatarGroup>
      </Box>

    </Box>
  )
}

export default Boardbar
