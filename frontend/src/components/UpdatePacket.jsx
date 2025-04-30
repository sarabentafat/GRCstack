import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePacket, fetchPacketById } from "../redux/apiCalls/packetApiCall";
import { packetActions } from "../redux/slices/packetSlice";
import { useParams } from "react-router-dom";

const UpdatePacket = () => {
  const { id } = useParams();
  const packetId = id;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: [{ optionText: "", isCorrect: false }] },
  ]);

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.packet);
  const authUser = useSelector((state) => state.auth.user);
  const packet = useSelector((state) => state.packet.packet);

  useEffect(() => {
    const fetchPacket = async () => {
      if (packetId) {
       dispatch(fetchPacketById(packetId));
         setQuestions(packet?.questions);
         setName(packet?.name);
         setDescription(packet?.description);
         


      }
    };
    fetchPacket();
  }, [dispatch, packetId]);

  const handleQuestionChange = (index, event) => {
    const { name, value } = event.target;
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions?.map((question, qIndex) => {
        if (qIndex === index) {
          return { ...question, [name]: value };
        }
        return question;
      });
      return updatedQuestions;
    });
  };

const handleOptionChange = (qIndex, oIndex, event) => {
  const { name, value } = event.target;
  setQuestions((prevQuestions) => {
    return prevQuestions?.map((question, index) => {
      if (index === qIndex) {
        const updatedOptions = question.options.map((option, optIndex) => {
          if (optIndex === oIndex) {
            return { ...option, [name]: value };
          }
          return option;
        });
        return { ...question, options: updatedOptions };
      }
      return question;
    });
  });
};


const toggleIsCorrect = (qIndex, oIndex) => {
  setQuestions((prevQuestions) => {
    return prevQuestions?.map((question, index) => {
      if (index === qIndex) {
        const updatedOptions = question.options?.map((option, optIndex) => {
          return { ...option, isCorrect: optIndex === oIndex };
        });
        return { ...question, options: updatedOptions };
      }
      return question;
    });
  });
};


  const addQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { questionText: "", options: [{ optionText: "", isCorrect: false }] },
    ]);
  };

  const addOption = (index) => {
    setQuestions((prevQuestions) => {
      const updatedQuestions = prevQuestions?.map((question, qIndex) => {
        if (qIndex === index) {
          const updatedOptions = [
            ...question.options,
            { optionText: "", isCorrect: false },
          ];
          return { ...question, options: updatedOptions };
        }
        return question;
      });
      return updatedQuestions;
    });
  };

const handleSubmit = async (event) => {
  event.preventDefault();

  if (!authUser || !authUser._id) {
    console.log("You must be logged in to update a packet");
    return;
  }

  dispatch(packetActions.setLoading(true));

  try {
    const packetData = {
      name,
      description,
      questions: JSON.stringify(questions, null, 2), // Convert questions array to a formatted JSON string
    };

    await dispatch(updatePacket(packetData, packetId));
    // Optionally reset form fields after successful submission
    setName("");
    setDescription("");
    setQuestions([
      { questionText: "", options: [{ optionText: "", isCorrect: false }] },
    ]);
  } catch (err) {
    console.error(err);
    // toast.error("Failed to update packet.");
  } finally {
    dispatch(packetActions.clearLoading());
  }
};


  return (
    <div className="p-6 rounded-lg lg:w-[80%]">
      <h2 className="text-4xl font-bold mb-4">Modifier le packet</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-2xl">
            Nom
          </label>
          <input
            id="name"
            type="text"
            placeholder={packet?.name || "Nom du packet"}
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
            placeholder={packet?.description || "Description du packet"}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 dark:bg-main p-2 block w-full bg-blue-50 border-0 border-b-2 border-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-0 text-2xl font-light placeholder:text-2xl placeholder:font-light placeholder-gray-500 placeholder-opacity-100"
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-2">Questions:</h3>
          {questions?.map((question, qIndex) => (
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
                  placeholder={question.questionText}
                  className="mt-1 p-2 block w-full dark:bg-second bg-white border-0 border-b-2 border-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-0 text-xl font-light placeholder:text-2xl placeholder:font-light placeholder-gray-500 placeholder-opacity-100"
                />
              </div>
              {question.options?.map((option, oIndex) => (
                <div key={oIndex} className="mb-2">
                  <label className="block font-light dark:bg-second">
                    Réponse:
                  </label>
                  <input
                    type="text"
                    name="optionText"
                    value={option.optionText}
                    placeholder={option.optionText}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                    required
                    className="mt-1 dark:bg-second p-2 block w-full bg-white border-0 border-b-2 border-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-0 font-light placeholder:text-2xl placeholder:font-light placeholder-gray-500 placeholder-opacity-100"
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
          {loading ? "Updating..." : "Update Packet"}
        </button>
      </form>
    </div>
  );
};

export default UpdatePacket;
