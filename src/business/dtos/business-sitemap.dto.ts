import { ApiProperty } from "@nestjs/swagger";

export class BusinessSitemapDTO {
  @ApiProperty({
    description: "Business unique identifier",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "Business name",
    example: "Restaurante La Bella",
  })
  name: string;
}

export class BusinessSitemapResponseDTO {
  @ApiProperty({
    type: [BusinessSitemapDTO],
    description: "Array of enabled businesses for sitemap generation",
  })
  businesses: BusinessSitemapDTO[];
}
