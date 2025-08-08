import { useState } from 'react'

export default function RegistrationForm({ competition, onClose }) {
  const [formData, setFormData] = useState({
    bookTitle: '',
    author: '',
    summary: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Submitting:', { competitionId: competition.id, ...formData })
    onClose()
  }

  return (
    <div className="p-6 bg-white rounded-lg w-96">
      <h2 className="mb-4 text-xl font-bold">Register for {competition.title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Book Title"
          value={formData.bookTitle}
          onChange={(e) => setFormData({...formData, bookTitle: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Author"
          value={formData.author}
          onChange={(e) => setFormData({...formData, author: e.target.value})}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Summary"
          value={formData.summary}
          onChange={(e) => setFormData({...formData, summary: e.target.value})}
          className="w-full p-2 border rounded"
          rows="4"
          required
        />
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  )
}