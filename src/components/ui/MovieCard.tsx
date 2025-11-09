import styled from "@emotion/styled";

import type { Recommendation } from "@/types/types";

const StyledCard = styled.div`
  position: relative;
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
`;

const StyledMatchChip = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: #fff;
  color: var(--primary);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: 600;
  z-index: 1;
`;

const StyledPosterSection = styled.div`
  flex: 0 0 24%;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  background: #f0f0f0;
`;

const StyledPoster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StyledInfoSection = styled.div`
  padding: 16px;
`;

const StyledTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #333;
`;

const StyledYear = styled.p`
  font-size: 1.4rem;
  color: #666;
  margin: 0 0 12px 0;
`;

const StyledGenreChips = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
`;

const StyledGenreChip = styled.span`
  padding: 4px 12px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  font-size: 1.2rem;
  color: #666;
`;

const StyledReason = styled.p`
  font-size: 1.4rem;
  color: #555;
  line-height: 1.6;
  margin: 0 0 16px 0;
`;

// const StyledViewDetailButton = styled.button`
//   width: 100%;
//   padding: 10px 16px;
//   background: var(--primary);
//   color: #fff;
//   border: none;
//   border-radius: 4px;
//   font-size: 1.4rem;
//   font-weight: 500;
//   cursor: pointer;
//   transition: opacity 0.2s;

//   &:hover {
//     opacity: 0.9;
//   }
// `;

interface MovieCardProps {
  movie: Recommendation;
}

export function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.posterPath
    ? `https://image.tmdb.org/t/p/w185${movie.posterPath}`
    : "";

  return (
    <StyledCard>
      <StyledMatchChip>{movie.matchPercentage}% match</StyledMatchChip>
      <StyledPosterSection>
        {posterUrl && <StyledPoster src={posterUrl} alt={movie.title} />}
      </StyledPosterSection>
      <StyledInfoSection>
        <StyledTitle>{movie.title}</StyledTitle>
        <StyledYear>{movie.year}</StyledYear>
        <StyledGenreChips>
          {movie.genres.map((genre, index) => (
            <StyledGenreChip key={index}>{genre}</StyledGenreChip>
          ))}
        </StyledGenreChips>
        <StyledReason>{movie.reason}</StyledReason>
        {/* <StyledViewDetailButton onClick={onViewDetail}>
          View Detail
        </StyledViewDetailButton> */}
      </StyledInfoSection>
    </StyledCard>
  );
}
