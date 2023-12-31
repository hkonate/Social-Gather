import { ApiProperty } from '@nestjs/swagger';
import { CategoryType, InclusionType } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDTO {
  @ApiProperty({
    description: "User's profile description",
    example: 'Hi I am John Doe and I love sports',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  bio?: string;

  @ApiProperty({
    description: "User's profile hobbies",
    example: 'Travel, Yoga',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  hobbies?: string;
}

export class ProfileResponsesDTO {
  @ApiProperty({
    description: 'ID of the profile',
    example: '7a9a72da-7e90-4fdf-9b1c-a7ea25af34d7',
  })
  id: string;

  @ApiProperty({
    description: "User's profile description",
    example: 'Hi I am John Doe and I love sports',
  })
  bio: string;

  @ApiProperty({
    description: "User's profile picture",
    example:
      'https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517112/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/ceabynqkowpq6ntjwfkn.jpg,https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517113/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/kjiqafhbyxghnunu4ame.jpg,https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517114/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/rlwhzmowr7zigdebt0ud.jpg',
    required: false,
  })
  picture: string;

  @ApiProperty({
    description: "User's profile hobbies",
    example: 'Travel, Yoga',
    required: false,
  })
  hobbies: string;

  @ApiProperty({
    description: 'Informations of the user',
    example: {
      id: '7a9a72da-7e90-4fdf-9b1c-a7ea25af34d7',
      pseudo: 'JohnDoe',
      phone: '0612234556',
      email: 'johndoe@gmail.com',
      listOfEventsCreated: [{
        id: '7a9a72da-7e90-4fdf-9b1c-a7ea25af34g0',
        title: 'Quick',
        limit: 16,
        price: 19,
        schedule: '2024-10-26T12:00',
        category: "CONCERT",
        address: '25 Bd de Sébastopol, 75001 Paris',
        inclusive: ["HALAL", "VEGAN"],
        images: [
          'https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517112/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/ceabynqkowpq6ntjwfkn.jpg,https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517113/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/kjiqafhbyxghnunu4ame.jpg,https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517114/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/rlwhzmowr7zigdebt0ud.jpg',
          'https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517112/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/ceabynqkowpq6ntjwfkn.jpg,https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517113/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/kjiqafhbyxghnunu4ame.jpg,https://res.cloudinary.com/dyay2jzz5/image/upload/v1700517114/SocialGather/7a9a72da-7e90-4fdf-9b1c-a7ea25af34d6/Event/rlwhzmowr7zigdebt0ud.jpg',
        ],
        listOfAttendees: [
          {
            id: '2z2d72da-7e90-4fdf-9b1c-a7ea25af34g0',
          },
          {
            id: '2z2d98da-7e90-4fdf-9b1c-a7ea87uf34g0',
          },
        ],
      }],
      listOfEventsToAttend: [
        {
          id: '2z2d72da-7e90-4fdf-9b1c-a7ea25af34g0',
        },
        {
          id: '2z2d98da-7e90-4fdf-9b1c-a7ea87uf34g0',
        },
      ],
    },
  })
  user: {
    id: string;
    pseudo: string;
    phone?: string;
    email: string;
    listOfEventsCreated: {
      id: string;
      title: string;
      limit: number;
      price: number;
      address: string;
      schedule: Date;
      category: CategoryType;
      inclusive: InclusionType[];
      images: string[];
      listOfAttendees: {
        id: string;
      }[];
    }[];
    listOfEventsToAttend: {
      id: string;
    }[];
  };
}
