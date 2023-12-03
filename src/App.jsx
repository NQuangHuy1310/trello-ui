import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useColorScheme } from '@mui/material/styles'

function ModeToggle() {
  const { mode, setMode } = useColorScheme()
  return (
    <Button
      onClick={() => {
        setMode(mode === 'light' ? 'dark' : 'light')
      }}
    >
      {mode === 'light' ? 'Turn dark' : 'Turn light'}
    </Button>
  )
}

function App() {
  return (
    <>
      <ModeToggle/>
      <Typography variant='body2' color="text.secondary">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perferendis reprehenderit voluptates officia saepe iure voluptate possimus itaque, blanditiis magnam alias magni quos ipsum tempore corporis rem animi tenetur consequatur unde.</Typography>
      <div className="">hello world from app</div>
      <Button variant="text">Text</Button>
      <Button variant="contained">Contained</Button>
      <Button variant="outlined">Outlined</Button>
    </>
  )
}

export default App
