/**
 * @todo YOU HAVE TO IMPLEMENT THE DELETE AND SAVE TASK ENDPOINT, A TASK CANNOT BE UPDATED IF THE TASK NAME DID NOT CHANGE, YOU'VE TO CONTROL THE BUTTON STATE ACCORDINGLY
 */
import { Check, Delete, Edit } from '@mui/icons-material';
import { Box, Button, Container, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch.ts';
import { Task } from '../index';

const TodoPage = () => {
  const api = useFetch();
  const [tasks, setTasks] = useState<Task[]>([]);
  const handleFetchTasks = async () => setTasks(await api.get('/tasks'));
  const [dto, setdto] = useState({id:'', name:''})
  const handleSave = async () => {
    if (dto.name.trim() !== "") {
      await api.post('/tasks', { name: dto.name });
      setdto({ id: "", name: "" });
      handleFetchTasks();
    }
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/tasks/${id}`);
    handleFetchTasks();
  };

  const [editId, setEditId] = useState<number | null>(null);
  const [newTaskName, setNewTaskName] = useState<string>("");
  const handleEditSave = async (id: number) => {
  if (newTaskName.trim() !== "") {
    await api.patch(`/tasks/${id}`, { name: newTaskName });
    setEditId(null);
    setNewTaskName("");
    handleFetchTasks();
  }
};

  useEffect(() => {
    (async () => {
      handleFetchTasks();
    })();
  }, []);

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography variant="h2">HDM Todo List</Typography>
      </Box>

      <Box display="flex" justifyContent="center" mt={5} flexDirection="column">
  {
    tasks.map((task) => (
      <Box key={task.id} display="flex" justifyContent="center" alignItems="center" mt={2} gap={1} width="100%">
        {
          editId === task.id ? (
            <TextField
              size="small"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              fullWidth
              sx={{ maxWidth: 350 }}
            />
          ) : (
            <TextField size="small" value={task.name} fullWidth sx={{ maxWidth: 350 }} disabled />
          )
        }
        <Box>
          {editId === task.id ? (
            <IconButton color="success" onClick={() => handleEditSave(task.id)}>
              <Check />
            </IconButton>
          ) : (
            <IconButton color="primary" onClick={() => { setEditId(task.id); setNewTaskName(task.name); }}>
              <Edit />
            </IconButton>
          )}
                <IconButton color="error" onClick={()=>handleDelete(task.id)}>
                  <Delete />
                </IconButton>
              </Box>
            </Box>
          ))
        }

        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
        <TextField
  size="small"
  value={dto.name}
  onChange={(e) => setdto({ ...dto, name: e.target.value })}
  placeholder="Nouvelle tâche"
  fullWidth
  sx={{ maxWidth: 350 }}
/>
          <Button variant="outlined" onClick={handleSave}>Ajouter une tâche</Button>
        </Box>
      </Box>
    </Container>
  );
}

export default TodoPage;
