<main class="p-4 md:ml-64 h-auto pt-20">

<div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4">
<h2 className="text-2xl font-bold mb-6 text-center">Create Session</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="course" className="block text-sm font-medium mb-1">
                Select your Course
              </label>
              <select
                id="course"
                name="course"
                value={formData.course}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a course</option>
                <option value="CS101">CS101</option>
                <option value="CS102">CS102</option>
                <option value="CS103">CS103</option>
              </select>
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-1">
                Date
              </label>
              <CustomDatePicker
                value={formData.date}
                onChange={handleDateChange}
                placeholder="Select date"
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium mb-1">
                  Start time
                </label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium mb-1">
                  End time
                </label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="lectureHall" className="block text-sm font-medium mb-1">
                Lecture Hall
              </label>
              <select
                id="lectureHall"
                name="lectureHall"
                value={formData.lectureHall}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a lecture hall</option>
                <option value="MainAuditorium">Main Auditorium</option>
                <option value="PLT1">PLT1</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Create Session
            </button>
          </form>
</div>

<div class="border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600 h-96 mb-4">
{sessionCode && (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Session Code:</h3>
            <p className="mb-4 break-all">{sessionCode}</p>
            <div className="flex justify-center">
              <QRCode value={sessionCode} size={200} bgColor="transparent" fgColor="white" />
            </div>
          </div>
        )}
</div>

</main>