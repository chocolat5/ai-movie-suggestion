import styled from "@emotion/styled";

import { ArrowOutward as ArrowOutwardIcon } from "@/components/ui/Icons";
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

const StyledActions = styled.div`
  display: flex;
  gap: var(--sp-sm);
  align-items: center;
  margin: var(--sp-md) 0;
`;

const StyledButton = styled.a`
  display: inline-flex;
  gap: var(--sp-xs);
  align-items: center;
  justify-content: center;
  padding: var(--sp-xs) var(--sp-md);
  color: var(--c-text);
  background: var(--c-bg-secondary);
  border: none;
  border-radius: var(--radius-4xl);
  font-size: var(--fs-sm);
  font-weight: 500;
  cursor: pointer;

  &[aria-disabled="true"] {
    opacity: 0.5;
    cursor: default;
    pointer-events: none;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

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
        <StyledActions>
          <StyledButton
            href={`https://www.themoviedb.org/movie/${movie.id}`}
            target="_blank"
          >
            Detail
            <ArrowOutwardIcon />
          </StyledButton>
          <StyledButton
            aria-disabled={!movie.trailerKey}
            href={
              movie.trailerKey
                ? `https://www.youtube.com/watch?v=${movie.trailerKey}`
                : ""
            }
            target="_blank"
          >
            Trailer
            <ArrowOutwardIcon />
          </StyledButton>
        </StyledActions>
      </StyledInfoSection>
      {posterUrl && <StyledPoster src={posterUrl} alt={movie.title} />}
      <StyledReason>{movie.reason}</StyledReason>
    </StyledCard>
  );
}
