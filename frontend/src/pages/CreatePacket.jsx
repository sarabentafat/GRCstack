import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPacket } from "../redux/apiCalls/packetApiCall";
import { packetActions } from "../redux/slices/packetSlice";

const CreatePacket = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: [{ optionText: "", isCorrect: false }] },
  ]);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.packet);
  const authUser = useSelector((state) => state.auth.user);

  const handleQuestionChange = (index, event) => {
    const { name, value } = event.target;
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[index][name] = value;
      return updatedQuestions;
    });
  };

  const handleOptionChange = (qIndex, oIndex, event) => {
    const { name, value } = event.target;
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[qIndex].options[oIndex][name] = value;
      return updatedQuestions;
    });
  };

  const toggleIsCorrect = (qIndex, oIndex) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      updatedQuestions[qIndex].options.forEach((option, index) => {
        updatedQuestions[qIndex].options[index].isCorrect = false;
      });
      updatedQuestions[qIndex].options[oIndex].isCorrect = true;
      return updatedQuestions;
    });
  };

  const addQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { questionText: "", options: [{ optionText: "", isCorrect: false }] },
    ]);
  };

  const addOption = (qIndex) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = [...prevQuestions];
      // Ensure immutability
      updatedQuestions[qIndex] = {
        ...updatedQuestions[qIndex],
        options: [
          ...updatedQuestions[qIndex].options,
          { optionText: "", isCorrect: false },
        ],
      };
      return updatedQuestions;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!authUser || !authUser._id) {
      console.log("You must be logged in to create a packet");
      return;
    }

    dispatch(packetActions.setLoading(true));

    try {
      const packetData = {
        name,
        description,
        questions,
      };

      await dispatch(createPacket(packetData, authUser._id));

      // Reset form fields after successful submission
      setName("");
      setDescription("");
      setQuestions([
        { questionText: "", options: [{ optionText: "", isCorrect: false }] },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(packetActions.clearLoading());
    }
  };

  return (
    <div className="p-6 rounded-lg lg:w-[80%]">
      <h2 className="text-4xl font-bold mb-4">Créer un packet</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-2xl">
            Nom
          </label>
          <input
            id="name"
            type="text"
            placeholder="Entrer un titre comme : chapitre 1 les devices de macrologie"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 p-2 block w-full bg-blue-50 dark:bg-main border-0 border-b-2 border-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-0 text-2xl font-light placeholder:text-2xl placeholder:font-light placeholder-gray-500 placeholder-opacity-100"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-2xl">
            Description:
          </label>
          <textarea
            id="description"
            value={description}
            placeholder="Ajouter une description.."
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 dark:bg-main p-2 block w-full bg-blue-50 border-0 border-b-2 border-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-0 text-2xl font-light placeholder:text-2xl placeholder:font-light placeholder-gray-500 placeholder-opacity-100"
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Questions:</h3>
          {questions.map((question, qIndex) => (
            <div
              key={qIndex}
              className="shadow dark:bg-second bg-white p-4 mb-4 rounded-md"
            >
              <div className="mb-4">
                <label className="block text-xl font-light">Question:</label>
                <input
                  type="text"
                  name="questionText"
                  value={question.questionText}
                  onChange={(e) => handleQuestionChange(qIndex, e)}
                  required
                  placeholder="question.."
                  className="mt-1 p-2 block w-full dark:bg-second bg-white border-0 border-b-2 border-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-0 text-xl font-light  placeholder:font-light placeholder-gray-500 placeholder-opacity-100"
                />
              </div>
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="mb-2">
                  <label className="block  font-light dark:bg-second">
                    Réponse:
                  </label>
                  <input
                    type="text"
                    name="optionText"
                    value={option.optionText}
                    placeholder=""
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                    required
                    className="mt-1 dark:bg-second p-2 block w-full bg-white border-0 border-b-2 border-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-0  font-light placeholder:text-2xl placeholder:font-light placeholder-gray-500 placeholder-opacity-100"
                  />
                  <label className="inline-flex items-center mt-2">
                    <input
                      type="checkbox"
                      name="isCorrect"
                      checked={option.isCorrect}
                      onChange={() => toggleIsCorrect(qIndex, oIndex)}
                      className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                    />
                    <span className="ml-2 font-light">Correct</span>
                  </label>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(qIndex)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Add Option
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addQuestion}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Add Question
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-2xl text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {loading ? "Creating..." : "Create Packet"}
        </button>
        {/* {error && <p className="text-red-500">{error}</p>} */}
      </form>
    </div>
  );
};

export default CreatePacket;
