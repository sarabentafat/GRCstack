import { createSlice } from "@reduxjs/toolkit";

const packetSlice = createSlice({
  name: "packet",
  initialState: {
    packet: null,
    packets: [],
    packetsp: [],
    docPackets: [],
    likedPackets: [],
    userpackets: [],
    starredQuestions: [], // Track starred questions
    mistakes: [], // Track mistakes if needed
    loading: false,
    isLiked: false,
    error: null,
    isProfileDeleted: false,
  },
  reducers: {
    setPacket(state, action) {
      state.packet = action.payload;
    },
    setPacketsP(state, action) {
      state.packetsp = action.payload;
    },
    setUserPackets(state, action) {
      state.userpackets = action.payload;
    },
    setPackets(state, action) {
      state.packets = action.payload;
    },
    setdocPackets(state, action) {
      state.docPackets = action.payload;
    },
    updateQuestionStar(state, action) {
      const { packetId, questionId, isStarred, userId } = action.payload;

      // Check if the packet in the state matches the packetId from the action
      if (state.packet && state.packet._id === packetId) {
        // Ensure the questions array exists in the packet
        if (!Array.isArray(state.packet.questions)) {
          state.packet.questions = [];
        }

        // Find the specific question by questionId
        const question = state.packet.questions.find(
          (q) => q._id === questionId
        );

        if (question) {
          console.log(isStarred);
          if (isStarred) {
            // If starring the question, add userId to the starredBy array if it's not already there
            if (!question.starredBy.includes(userId)) {
              question.starredBy.push(userId);
            }
          } else {
            // If un-starring the question, remove userId from the starredBy array
            question.starredBy = question.starredBy.filter(
              (id) => id !== userId
            );
          }
        }
      }
    },
    updateQuestionMistakes(state, action) {
      const { packetId, questionId, mistakesCount } = action.payload;
      const packet = state.packets.find((packet) => packet._id === packetId);
      if (packet) {
        const question = packet.questions.find(
          (question) => question._id === questionId
        );
        if (question) {
          question.mistakesCount = mistakesCount; // Update mistakes count for question
        }
      }
    },
    addMistake(state, action) {
      state.mistakes.push(action.payload); // Track mistakes if needed
    },
    setMistakes(state, action) {
      state.mistakes = action.payload; // Set the mistakes state
    },
    updatePacketLikes(state, action) {
      const { packetId, likes } = action.payload;
      state.packet.likes = likes;
      const packet = state.packets.find((packet) => packet._id === packetId);
      if (packet) {
        packet.likes = likes; // Update likes count
      }
    },
    setPacketPhoto(state, action) {
      if (state.packet) {
        state.packet.packetPhoto = action.payload;
      }
    },
    setLikedPackets(state, action) {
      state.likedPackets = action.payload;
    },
    addPacket(state, action) {
      state.packets.push(action.payload);
    },
    updatePacket(state, action) {
      state.packet = action.payload;
    },
    setLoading(state) {
      state.loading = true;
    },
    clearLoading(state) {
      state.loading = false;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setIsLikedPacket(state, action) {
      if (state.packet) {
        state.packet.isLiked = action.payload;
      }
    },
    clearError(state) {
      state.error = null;
    },
    setIsProfileDeleted(state) {
      state.isProfileDeleted = true;
      state.loading = false;
    },
    clearIsProfileDeleted(state) {
      state.isProfileDeleted = false;
      state.loading = false;
    },
  },
});

const packetReducer = packetSlice.reducer;
const packetActions = packetSlice.actions;
export { packetReducer, packetActions };
