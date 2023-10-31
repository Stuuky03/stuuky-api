import { makeCreateQuestionController } from "@/infra/http/factories/controllers/CreateQuestionControllerFactory";
import { makeCreateStudentController } from "@/infra/http/factories/controllers/CreateStudentControllerFactory";
import { Student as StudentRaw, Question as QuestionRaw } from "@prisma/client";
import { arg, inputObjectType, mutationType, nonNull } from "nexus";

const Mutation = mutationType({
  definition(t) {
    t.field('signupStudent', {
      type: 'Student',
      args: {
        data: nonNull(
          arg({
            type: 'UserCreateInput'
          })
        )
      },
      resolve: async (_parent, { data }, { prisma }): Promise<StudentRaw> => {
        const student = await (await makeCreateStudentController().handle(data)).data

        return student
      }
    })

    t.field('createQuestion', {
      type: 'Question',
      args: {
        data: nonNull(
          arg({
            type: 'CreateQuestionInput'
          })
        )
      },
      resolve: async (_parent, { data }, { prisma }): Promise<QuestionRaw> => {
        const question = await (await makeCreateQuestionController().handle(data)).data

        return question
      }
    })

  }
})

export const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  definition(t) {
    t.nonNull.string('username');
    t.nonNull.string('firstName');
    t.nonNull.string('lastName');
    t.nonNull.string('email');
    t.nonNull.string('password');
  }
})

export const CreateQuestionInput = inputObjectType({
  name: 'CreateQuestionInput',
  definition(t) {
    t.nonNull.string('title')
    t.nonNull.string('content')
    t.nonNull.boolean('isDraft')
    t.nonNull.field('createdAt', { type: 'DateTime' })
    t.nonNull.string('studentId')
    t.nonNull.string('courseId')
    t.nonNull.list.nonNull.string('tags');
  }
})

export default { Mutation, UserCreateInput, CreateQuestionInput }