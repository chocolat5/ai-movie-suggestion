import styled from "@emotion/styled";

import type { Recommendation } from "@/types/types";

const StyledCard = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 1fr 100px;
  gap: var(--sp-md);
  padding: var(--sp-md);
  background: var(--c-bg-alt);
  border-radius: var(--radius-xl);
  overflow: hidden;
`;

const StyledMatchChip = styled.div`
  display: inline-block;
  background: var(--c-bg-inverse);
  color: var(--c-text-inverse);
  padding: 2px var(--sp-sm);
  border-radius: var(--radius-2xl);
  font-size: var(--fs-xs);
  font-weight: 600;
  z-index: 1;
`;

const StyledPoster = styled.img`
  grid-column: 2 / -1;
  grid-row: 1 / 2;
  aspect-ratio: 2 / 3;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-2xl);
`;

const StyledInfoSection = styled.div`
  grid-column: 1 / 2;
  grid-row: 1 / 2;
`;

const StyledTitle = styled.h3`
  margin: var(--sp-md) 0 0 0;
  color: #333;
  font-size: var(--fs-md);
  font-weight: 600;
  line-height: var(--lh-tight);
`;

const StyledYear = styled.p`
  margin: var(--sp-xs) 0 0 0;
  color: #666;
  font-size: var(--fs-sm);
  line-height: var(--lh-tight);
`;

const StyledGenreChips = styled.div`
  display: flex;
  gap: var(--sp-sm);
  margin: var(--sp-sm) 0 0 0;
  flex-wrap: wrap;
`;

const StyledGenreChip = styled.span`
  padding: 2px var(--sp-sm);
  background: var(--c-bg-alt);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-2xl);
  font-size: var(--fs-xs);
  color: var(--c-text-sub);
`;

const StyledReason = styled.p`
  grid-column: 1 / -1;
  grid-row: 2 / 3;
  font-size: var(--fs-sm);
  color: var(--c-text-sub);
  line-height: var(--lh-normal);
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
      <StyledInfoSection>
        <StyledMatchChip>{movie.matchPercentage}% match</StyledMatchChip>
        <StyledTitle>{movie.title}</StyledTitle>
        <StyledYear>{movie.year}</StyledYear>
        <StyledGenreChips>
          {movie.genres.map((genre, index) => (
            <StyledGenreChip key={index}>{genre}</StyledGenreChip>
          ))}
        </StyledGenreChips>
      </StyledInfoSection>
      {posterUrl && <StyledPoster src={posterUrl} alt={movie.title} />}
      <StyledReason>{movie.reason}</StyledReason>
      {/* <StyledViewDetailButton onClick={onViewDetail}>
          View Detail
        </StyledViewDetailButton> */}
    </StyledCard>
  );
}
