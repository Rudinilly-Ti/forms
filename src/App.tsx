import { useState } from 'react';
import './styles/global.css';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from './components/Button';

const createUserFormSchema = z.object({
  name: z.string().nonempty("O nome é obrigatório").transform(name =>{
    return name.trim().split(' ').map(word => {
      return word[0].toUpperCase().concat(word.substring(1));
    }).join(' ');}),
  email: z.string().email("Formato de email inválido").nonempty("O email é obrigatório").toLowerCase().refine(email => {
    return email.endsWith('@gmail.com')
  }, 'O email precisa ser do gmail'),
  password: z.string().min(6, 'A senha precisa de no mínimo 6 caracteres'),
  techs: z.array(z.object({
    title: z.string().nonempty('O título é obrigatório'),
    knowledge: z.coerce.number().min(1).max(100)
  })).min(2, 'É necessário ter no mínimo duas tecnologia')
})

type CreateUserFormData = z.infer<typeof createUserFormSchema>;

function App() {
  const [output, setOutput] = useState('');
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    control 
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema)
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techs',
  })

  function crateUser(data: CreateUserFormData) {
    setOutput(JSON.stringify(data, null, 2));
  }

  function addNewTech() {
    append({ title: '', knowledge: 0 })
  }

  function removeTech(index: number) {
    remove(index)
  }

  return (
    <main className='h-screen bg-zinc-950 text-zinc-300 flex flex-col gap-10 items-center justify-center'>
      <form action="" onSubmit={handleSubmit(crateUser)} className='flex flex-col gap-4 w-full max-w-xs'>
      <div className='flex flex-col gap-1'>
          <label htmlFor="name">Name</label>
          <input 
            type="text"
            className='border border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white'
            {...register('name')}
            />
            {errors.name && <span className='text-red-500 text-sm'>{errors.name.message}</span>}
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="email">E-mail</label>
          <input 
            type="email"
            className='border border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white'
            {...register('email')}
            />
            {errors.email && <span className='text-red-500 text-sm'>{errors.email.message}</span>}
        </div>
      
        <div className='flex flex-col gap-1'>
          <label htmlFor="password">Senha</label>
          <input 
            type="password"
            className='border border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white' 
            {...register('password')}
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor="" className='flex items-center justify-between'>
            Tecnologias

          <button 
            type='button'
            className='text-emerald-500 text-sm' 
            onClick={addNewTech}
          >
            Adicionar
          </button>
          </label>

          {fields.map((field, index) => {
            return  (
              <div key={field.id} className='flex gap-2'>
                <div className='flex-1  flex flex-col gap-1'>
                  <input 
                  type="text"
                  className='border border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white' 
                  {...register(`techs.${index}.title`)}
                  />
                  {errors.techs?.[index]?.title && <span className='text-red-500 text-sm'>{errors.techs?.[index]?.title?.message}</span>}
                </div>
                <div className='w-16 flex flex-col gap-1'>
                  <input 
                  type="number"
                  className=' border border-zinc-800 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white' 
                  {...register(`techs.${index}.knowledge`)}
                  />
                  {errors.techs?.[index]?.knowledge && <span className='text-red-500 text-sm'>{errors.techs?.[index]?.knowledge?.message}</span>}
                </div>
                <button className='bg-red-500 w-16 rounded' onClick={() => removeTech(index)} type="button">X</button>
              </div>
            )})
          }
          {errors.techs && <span className='text-red-500 text-sm'>{errors.techs.message}</span>}
        </div>
      
        <button
          type='submit'
          className='bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600'
         >Salvar</button>
      </form>
      <pre>{output}</pre>
      <div className='flex flex-col gap-6 items-center justify-center'>
        <Button success className='w-20'>Sign In</Button>
        <Button size='sm'>Sign In</Button>
        <Button>Sign In</Button>
        <Button size='xs'>Sign In</Button>
        <Button>Sign In</Button>
        <Button>Sign In</Button>
      </div>
    </main>
  )
}

export default App
